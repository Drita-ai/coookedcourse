export const normalizePlaylists = (data) => {
    return data.map((playlist) => ({
        collegeName: playlist.collegeName,
        overallCoverage: playlist.overallCoverage,
        totalMatchedVideos: playlist.totalMatchedVideos,

        units: playlist.units.map((unitObj, unitIndex) => {
            const unitName = Object.keys(unitObj)[0];

            const topics = unitObj[unitName].flatMap(
                (topicObject, topicIndex) =>
                    Object.entries(topicObject).map(
                        ([topicName, topicData]) => ({
                            id: `${unitIndex}-${topicIndex}-${topicName}`,
                            topicName,

                            matchedVideos:
                                topicData?.matchedYoutubeTitles?.items || [],

                            matchedTopics:
                                topicData?.matchedSyllabusTopics?.items || [],

                            unmatchedTopics:
                                topicData?.unmatchedSyllabusTopics?.items || [],

                            matchedVideoCount:
                                topicData?.matchedYoutubeTitles?.count || 0,
                        })
                    )
            );

            return {
                id: unitIndex,
                unitName,
                topics,
            };
        }),
    }));
}