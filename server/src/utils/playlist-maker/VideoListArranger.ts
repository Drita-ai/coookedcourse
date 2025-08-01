import type { CookedTopics } from '../../types/cookedcourse';
import type { AnalyzedSyllabus, LLMPassedSyllabusYoutubeTopics, VideoListItem } from '../../types/playlistMaker';
import { axiosPostWithRetry } from './playlistMakerUtils';

export class VideoListArranger {
    private videoList;
    private channelsListWithTopics?: VideoListItem[]
    private analyzedSyllabus?: AnalyzedSyllabus;
    private channelsListWithVideoDetails?: any;

    constructor(videoList: any = '') {
        this.videoList = videoList;
    }

    extractVideosDetails() {
        this.channelsListWithVideoDetails = this.videoList.reduce((acc: any, videDetailsItem: any) => {
            // Check if the promise was fulfilled and contains items
            if (
                videDetailsItem.status === 'fulfilled' && videDetailsItem.value
            ) {
                const apiResponse = videDetailsItem.value;
                const firstItemSnippet = apiResponse[0].snippet;

                // Map over the items in the current API response to create the video list
                const videoItems = apiResponse.map((item: any) => {
                    return {
                        itemId: item.id,
                        title: item.snippet.title,
                        // Note: videoId is in contentDetails, not snippet
                        videoId: item.contentDetails.videoId,
                    };
                });

                // Create the main object for this channel/playlist
                const channelObject = {
                    channelName: firstItemSnippet.channelTitle,
                    channelId: firstItemSnippet.channelId,
                    playlistId: firstItemSnippet.playlistId,
                    items: videoItems, // Assign the mapped video items
                };

                // Add the newly created object to our results array
                acc.push(channelObject);
            }

            return acc;
        }, []); // The initial value is now an empty array []

        return this.channelsListWithVideoDetails;
    }

    extractVideosTopics() {
        this.channelsListWithTopics = this.videoList.reduce((acc: any, videoListItem: any) => {
            // Check if the promise was fulfilled and contains a value
            if (videoListItem.status === 'fulfilled' && videoListItem.value) {
                // Iterate over each video object in the value array
                videoListItem.value.forEach((videoItem: any) => {
                    const { channelTitle, title } = videoItem.snippet;

                    // If the channelName doesn't exist as a key in accumulator object, create it
                    if (!acc[channelTitle]) {
                        acc[channelTitle] = [];
                    }

                    // Push the current video's title to the corresponding channelName array
                    acc[channelTitle].push(title);
                });
            }
            return acc;
        }, {});

        return this.channelsListWithTopics
    }

    async topicComparison(videoTitles: VideoListItem[], syllabusTopics: CookedTopics) {
        // Get VIDEO TITLES and SYLLABUS TOPICS

        /**
         * Pass it to LLM :
         *  1) To Compare and then GET,
         *  2) How many topics from SYLLABUS matches that of VIDEOS' Titles and then 
         *     GET:
         *      i) MATCHED TOPICS ( with quantity )
         *      ii) UNMATCHED TOPICS ( with quantity )
         */
        const payload: LLMPassedSyllabusYoutubeTopics = {
            syllabus_topics: syllabusTopics,
            channel_topics: videoTitles
        }

        // Pass to LLM to analyze
        this.analyzedSyllabus = await axiosPostWithRetry(process.env.LLM_ANALYZE_URL!, payload)
    }
}