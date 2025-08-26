declare namespace Express {
    export interface Request {
        _cooked_client?: string;
        __cc_reference_ids?: string[];
        __cc_final_syllabus?: Record<string, any>
    }
}