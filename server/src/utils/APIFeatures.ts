type QueryString = {
    [key: string]: any;
}

class APIFeatures<T> {
    private query: T;
    private queryString: QueryString;

    constructor(query: T, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }
}