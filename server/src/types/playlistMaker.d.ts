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

export interface VideoItemDetails {
    itemId?: string,
    title?: string,
    videoId?: string
}

/**
 * Analyzed Topics 
 */
interface MatchedItemList {
    items: string[] | [],
    count: number
}

interface MatchedItemDetails {
    matchedYoutubeTitles: MatchedItemList,
    matchedSyllabusTopics: MatchedItemList,
    unmatchedSyllabusTopics: MatchedItemList,
}

interface AnalyzedMainTopics {
    [mainTopic: string]: MatchedItemDetails
}

interface AnalyzedUnit {
    [unit: string]: AnalyzedMainTopics[]
}

export interface AnalyzedSyllabus {
    unmatchedYoutubeTopics: MatchedItemList;
    [channelName: string]: AnalyzedUnit[] | MatchedItemList;
}

/**
 * Interface for SYLLABUS and YOUTUBE TOPICS passed to LLM
 */
export interface LLMPassedSyllabusYoutubeTopics {
    syllabus_topics: CookedTopics,
    channel_topics: VideoListItem[]
}

/**
 * Types for APIFeatures
 */
export interface MainTopicAnalysis {
    title: string;
    details: MatchedItemDetails;
}

export interface UnitAnalysis {
    unitNumber: number;
    title: string;
    mainTopics: MainTopicAnalysis[];
}

export type RawUnitData = { [unit: string]: { [mainTopic: string]: MatchedItemDetails }[] }[];

export interface CollegeAnalysis {
    collegeName: string;
    units: UnitAnalysis[];
    unmatchedYoutubeTopics: MatchedItemList;
    overallCoverage?: number;
    totalMatchedVideos?: number;
}

// Helper type for Express query object
export type QueryString = import('qs').ParsedQs;