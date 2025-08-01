import type { CookedTopics } from '../../types/cookedcourse';
import { getRedisClient } from '../redis-client/getRedisClient';
import { CK_CHANNELS_WITH_VIDEOS_DETAILS, CK_CHANNELS_WITH_VIDEOS_TITLES, CK_COOKED_PLAYLIST_LIST, CK_COOKED_PLAYLIST_VIDEOS_LIST } from '../../constants/constants';
import { checkInCacheAndSet, fetchTemplate } from '../redis-client/checkExistsInCache';
import { extractPlaylistIds, fetchAllVideosWithRetry } from './playlistMakerUtils';
import { VideoListArranger } from './VideoListArranger';
import type { VideoListItem } from '../../types/playlistMaker';

export class CuratePlaylist {
    private topics: CookedTopics;
    private subject: string;
    private SEARCH_PLAYLIST_URL: string;
    extractedTopics?: string[];

    constructor(topics: CookedTopics, subject: string) {
        this.topics = topics
        this.subject = subject
        this.SEARCH_PLAYLIST_URL = this.makePlaylistURL()
    }

    private makePlaylistURL(): string {
        return process.env.SEARCH_PLAYLIST_URL!.replace('[SUBJECT]', this.subject).replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
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

        return playlistsItem
    }

    /**
     * Funtion to return all videos of related PLAYLIST 
     */
    async fetchPlaylistVideos(clientToken: string = '') {
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
            // Fetch all the Videos List
            const vidoesItems = (await fetchAllVideosWithRetry(playlistVideoURLS));

            // Arrange Video List
            vla = new VideoListArranger(vidoesItems);

            channelsListWithTopics = vla.extractVideosTopics()!;
            await redisClient.set(`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${clientToken}`, JSON.stringify(channelsListWithTopics))
            console.log("inside")
            await redisClient.set(`${CK_CHANNELS_WITH_VIDEOS_DETAILS}#${clientToken}`, JSON.stringify(vla.extractVideosDetails()))
        }

        channelsListWithTopics = JSON.parse((await redisClient.get(`${CK_CHANNELS_WITH_VIDEOS_TITLES}#${clientToken}`))!)
        const channelListWithVideoDetails = JSON.parse((await redisClient.get(`${CK_CHANNELS_WITH_VIDEOS_DETAILS}#${clientToken}`))!)

        // GET Analyzed topics 
        const analyzedTopics = (await vla!.topicComparison(channelsListWithTopics!, this.topics))!

        return { channelListWithVideoDetails, analyzedTopics }
    }
}