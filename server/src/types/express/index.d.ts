declare global {
    namespace Express {
        export interface Request {
            _cooked_client?: string
        }
    }
}

export { }