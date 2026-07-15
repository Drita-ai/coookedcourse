declare namespace Express {
    export interface Request {
        _cooked_client?: string;
        __to_extract_topics_of_chapters?: string[];
        __already_extracted_chapters?: string[];
        __to_analyze_chapters?: string[];
    }
}