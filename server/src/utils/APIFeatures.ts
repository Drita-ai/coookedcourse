import { CollegeAnalysis, QueryString, MatchedItemList, RawUnitData, MatchedItemDetails } from '../types/playlistMaker'

export interface PaginationMetadata {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
    nextPage?: number;
    previousPage?: number;
}

export class APIFeature {
    public data: CollegeAnalysis[];
    public metadata: PaginationMetadata = {} as PaginationMetadata;
    private readonly queryString: QueryString;

    constructor(rawData: Record<string, any>[], queryString: QueryString) {
        this.queryString = queryString;

        const transformedData = rawData.map(rawCollegeObject => {
            const collegeName = Object.keys(rawCollegeObject).find(
                key => key !== 'unmatchedYoutubeTopics'
            );

            if (!collegeName) {
                return null;
            }

            const units: RawUnitData = rawCollegeObject[collegeName];
            const unmatchedYoutubeTopics: MatchedItemList = rawCollegeObject.unmatchedYoutubeTopics;

            return {
                collegeName,
                units,
                unmatchedYoutubeTopics,
            };
        });

        this.data = JSON.parse(JSON.stringify(transformedData.filter(Boolean)));
    }

    /**
     * Calculates and adds aggregate fields. This method should now work correctly.
     */
    public calculateFields(): this {
        this.data.forEach(college => {
            let totalMatchedTopics = 0;
            let totalUnmatchedTopics = 0;
            let totalVideos = 0;

            college.units.forEach(unitObject => {
                const mainTopicsArray = Object.values(unitObject)[0];
                mainTopicsArray.forEach((mainTopicObject: MatchedItemDetails) => {
                    const details = Object.values(mainTopicObject)[0];
                    if (details) {
                        totalMatchedTopics += details.matchedSyllabusTopics?.count || 0;
                        totalUnmatchedTopics += details.unmatchedSyllabusTopics?.count || 0;
                        totalVideos += details.matchedYoutubeTitles?.count || 0;
                    }
                });
            });

            const overallTotalTopics = totalMatchedTopics + totalUnmatchedTopics;
            college.overallCoverage = overallTotalTopics > 0 ? (totalMatchedTopics / overallTotalTopics) * 100 : 0;
            college.totalMatchedVideos = totalVideos;
        });
        return this;
    }

    public filter(): this {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'include', 'q'];
        excludedFields.forEach(el => delete queryObj[el]);

        if (Object.keys(queryObj).length === 0) return this;

        this.data = this.data.filter(college => {
            return Object.entries(queryObj).every(([key, value]) => {
                const collegeValue = (college as any)[key];
                if (collegeValue === undefined) return false;

                if (typeof value === 'object' && value !== null) {
                    const [op, opValue] = Object.entries(value)[0];
                    const numericValue = parseFloat(opValue as string);

                    if (isNaN(numericValue)) return false;

                    if (op === 'gte') return collegeValue >= numericValue;
                    if (op === 'gt') return collegeValue > numericValue;
                    if (op === 'lte') return collegeValue <= numericValue;
                    if (op === 'lt') return collegeValue < numericValue;
                }
                return collegeValue == value;
            });
        });

        return this;
    }

    public sort(): this {
        const sortBy = this.queryString.sort as string;
        if (!sortBy) {
            this.data.sort((a, b) => a.collegeName.localeCompare(b.collegeName));
            return this;
        }

        const fields = sortBy.split(',');
        this.data.sort((a, b) => {
            for (const field of fields) {
                const order = field.startsWith('-') ? -1 : 1;
                const key = field.replace('-', '') as keyof CollegeAnalysis;

                const valA = (a as any)[key];
                const valB = (b as any)[key];

                if (valA === undefined || valB === undefined) return 0;

                if (valA < valB) return -1 * order;
                if (valA > valB) return 1 * order;
            }
            return 0;
        });
        return this;
    }

    public limitFields(): this {
        const includeQuery = (this.queryString.include as string)?.split(',') || [];
        if (!includeQuery.includes('unmatchedYoutubeTopics')) {
            this.data.forEach(college => {
                delete (college as Partial<CollegeAnalysis>).unmatchedYoutubeTopics;
            });
        }
        return this;
    }

    public paginate(): this {
        const page = parseInt(this.queryString.page as string, 10) || 1;
        const limit = parseInt(this.queryString.limit as string, 10) || 3;
        const totalResults = this.data.length;
        const totalPages = Math.ceil(totalResults / limit);
        const skip = (page - 1) * limit;

        this.metadata = { page, limit, totalResults, totalPages };
        if (page < totalPages) this.metadata.nextPage = page + 1;
        if (page > 1) this.metadata.previousPage = page - 1;

        this.data = this.data.slice(skip, skip + limit);
        return this;
    }
}