import type { CookedTopics } from '../../types/cookedcourse';
import { getRedisClient } from '../redis-client/getRedisClient';
import { CK_CHANNELS_WITH_VIDEOS_DETAILS, CK_CHANNELS_WITH_VIDEOS_TITLES, CK_COOKED_PLAYLIST_LIST, CK_COOKED_PLAYLIST_VIDEOS_LIST } from '../../constants/constants';
import { checkInCacheAndSet, fetchTemplate } from '../redis-client/checkExistsInCache';
import { extractPlaylistIds, fetchAllVideosWithRetry } from './playlistMakerUtils';
import { VideoListArranger } from './VideoListArranger';
import type { CollegeAnalysis, QueryString, VideoListItem } from '../../types/playlistMaker';
import { APIFeature } from '../APIFeatures';

export class CuratePlaylist {
    private topics;
    private subject: string;
    private SEARCH_PLAYLIST_URL: string;
    private MAX_PLAYLISTS_TO_FETCH: string;
    public extractedTopics?: string[];

    constructor(topics, subject: string) {
        this.topics = topics
        this.subject = subject
        this.SEARCH_PLAYLIST_URL = this.makePlaylistURL()
        this.MAX_PLAYLISTS_TO_FETCH = '3'
    }

    private makePlaylistURL(): string {
        return process.env.SEARCH_PLAYLIST_URL!
            .replace('[MAX_PLAYLISTS_TO_FETCH]', '3')
            .replace('[SUBJECT]', this.subject)
            .replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
    }

    private makeVideosOfPlaylistURL(playlistId: string): string {
        return process.env.SEARCH_PLAYLIST_VIDEOS_URL!.replace('[PLAYLIST_ID]', playlistId).replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
    }

    /**
     * Funtion to return all playlists of related subject 
     */
    private async fetchPlaylists(token: string) {
        /**
         * TODO: Better Key Generation
         */
        const cacheKey = `${token}#${CK_COOKED_PLAYLIST_LIST}`

        const playlistsItem = await fetchTemplate(cacheKey, this.SEARCH_PLAYLIST_URL)

        return playlistsItem;
    }

    /**
     * Funtion to return all videos of related PLAYLIST 
     */
    async fetchPlaylistVideos(clientToken: string = '', query: QueryString, chaptersData) {
        // Fetch Playlists
        const fetchedPlaylists = await this.fetchPlaylists(clientToken)

        // Extract playlist ids from the Playlists
        const playlistIds: string[] = extractPlaylistIds(fetchedPlaylists.items)

        // Make the Video URLS
        const playlistVideoURLS: string[] = playlistIds.map((playlistId: string) => this.makeVideosOfPlaylistURL(playlistId))

        // GET Redis client
        const redisClient = await getRedisClient()

        let vla: VideoListArranger = new VideoListArranger();
        let channelsListWithTopics: VideoListItem[] | undefined = undefined;

        // Prior to making Request, Check curated items in cache
        if (!(await redisClient.get(`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${clientToken}`))) {
            console.log("Storing api result in cache")
            // Fetch all the Videos List
            const vidoesItems = (await fetchAllVideosWithRetry(playlistVideoURLS));

            // Arrange Video List
            vla = new VideoListArranger(vidoesItems);

            channelsListWithTopics = vla.extractVideosTopics()!;
            await redisClient.set(`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${clientToken}`, JSON.stringify(channelsListWithTopics))
            await redisClient.set(`${CK_CHANNELS_WITH_VIDEOS_DETAILS}#${clientToken}`, JSON.stringify(vla.extractVideosDetails()))
        }

        channelsListWithTopics = JSON.parse((await redisClient.get(`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${clientToken}`))!)

        // TODO: Will SEND accordingly
        const channelListWithVideoDetails = JSON.parse((await redisClient.get(`${CK_CHANNELS_WITH_VIDEOS_DETAILS}#${clientToken}`))!);

        let analyzedTopics;

        if (!(await redisClient.get('analyzed-topics-llm-response'))) {
            // GET Analyzed topics 
            await redisClient.set('analyzed-topics-llm-response', JSON.stringify((await vla!.topicComparison(channelsListWithTopics!, this.topics))! as any));
        }

        analyzedTopics = JSON.parse(await redisClient.get('analyzed-topics-llm-response') || '')

        // Store matchedVideoTitles with their videoId(s)
        const analyzedTopicsToSave = analyzedTopics.flatMap((analyzedTopic) => {
            // Channel details that is to be processed
            const channel = channelListWithVideoDetails.find(
                (c) => c.channelName === analyzedTopic.channelName
            );

            return analyzedTopic.analyzedPlaylistData.sylabus_analysis.map(analysis => {
                // Find chapter data
                const chapterData = chaptersData.find(
                    c => c.name === analysis.unit_name
                )

                // Map the matched video titles to their respective YT IDs
                const matchedVideos = channel
                    ? channel.items
                        .filter((video) => analysis.matched_videos_titles.includes(video.title))
                        .map((video) => ({
                            ytVideoTitle: video.title,
                            ytVideoId: video.videoId,
                        }))
                    : [];

                return {
                    channelName: analyzedTopic.channelName,
                    matchedSyllabusTopics: analysis.matched_videos_titles,
                    unmatchedSyllabusTopics: analysis.unmatched_topics,
                    unitCoveragePercentage: analysis.unit_coverage_percentage,
                    chapterId: chapterData.id,
                    matchedYoutubeTitles: {
                        create: matchedVideos
                    }
                }
            }
            )
        })

        // const finalAnalyzedTopics = new APIFeature(analyzedTopics as unknown as CollegeAnalysis[], query).calculateFields().filter().sort().limitFields().paginate();

        return {
            analyzedTopicsToSave
        }
    }
}