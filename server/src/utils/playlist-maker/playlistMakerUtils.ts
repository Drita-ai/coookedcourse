import axios from 'axios'

/**
 * Returns playlist ids
 */
export const extractPlaylistIds = (playlists: any[]): string[] => {
    return playlists.map((playlist: any) => playlist.id.playlistId)
}

/**
 * A helper function that performs an axios GET request with a retry mechanism.
 */
const axiosGetWithRetry = async (url: string, retries: number) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.error(`Attempt ${attempt} failed for URL: ${url}. Retrying...`);
            if (attempt === retries) {
                // If this was the last attempt, throw the error
                throw err;
            }
            // Wait 1 second before the next attempt
            await new Promise(res => setTimeout(res, 1000));
        }
    }
};

/**
 * Fetches all video items from a list of YouTube playlist URLs
 */
export const fetchAllVideosWithRetry = (URLS: string[], retries = 3) => {
    const promises = URLS.map(url =>
        (async () => {
            let allItems = [];
            let nextPageToken = null;
            let isFirstRequest = true;

            do {
                // Construct the URL for the current page with pageToken
                const urlToFetch = isFirstRequest ? url : `${url}&pageToken=${nextPageToken}`;

                // Fetch the data using retry helper
                const response = await axiosGetWithRetry(urlToFetch, retries);

                if (response.items) {
                    allItems.push(...response.items);
                }

                // Update the token for the next iteration
                nextPageToken = response.nextPageToken;
                isFirstRequest = false;

            } while (nextPageToken); // Loop until there are no more pages

            return allItems;
        })()
    );

    return Promise.allSettled(promises);
};