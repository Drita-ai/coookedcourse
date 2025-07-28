/*
    TYPES for PlaylistMaker
*/

import { CookedTopics } from './cookedcourse'

type Topics = {
    [key: string]: string[]
}

export interface VideoListItem {
    [channelName: string]: string[]
}

/**
 * Analyzed Topics 
 */
interface MatchedItemList {
    items: string[] | [],
    count: number
}

interface MatchedItemDetails {
    matchedYoutubeTitles: MatchedItemDetails,
    matchedSyllabusTopics: MatchedItemDetails,
    unmatchedSyllabusTopics: MatchedItemDetails,
}

interface AnalyzedMainTopics {
    [mainTopic: string]: MatchedItemDetails
}

interface AnalyzedUnit {
    [unit: string]: AnalyzedMainTopics[]
}

export interface AnalyzedSyllabus {
    [channelName: string]: AnalyzedUnit[],
    "unmatchedYoutubeTopics": MatchedItemDetails
}

/**
 * Interface for SYLLABUS and YOUTUBE TOPICS passed to LLM
 */
export interface LLMPassedSyllabusYoutubeTopics {
    syllabus_topics: CookedTopics,
    channel_topics: VideoListItem[]
}