import type { CookedTopics } from '../../types/cookedcourse';
import { getRedisClient } from '../redis-client/getRedisClient';
import { CK_COOKED_PLAYLIST_LIST } from '../../constants/constants';
import { checkInCacheAndSet, fetchTemplate } from '../redis-client/checkExistsInCache';
import { extractPlaylistIds, fetchAllVideosWithRetry } from './playlistMakerUtils';

export class CuratePlaylist {
    private topics: CookedTopics;
    private subject: string;
    private SEARCH_PLAYLIST_URL: string;

    constructor(topics: CookedTopics, subject: string) {
        this.topics = topics
        this.subject = subject
        this.SEARCH_PLAYLIST_URL = this.makePlaylistURL()
    }

    private makePlaylistURL(): string {
        return process.env.SEARCH_PLAYLIST_URL!.replace('[SUBJECT]', this.subject).replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
    }

    private makeVideosOfPlaylistURL(playlistId: string): string {
        return process.env.SEARCH_PLAYLIST_VIDEOS_URL!.replace('[PLAYLIST_ID]', playlistId).replace('[YOUR_API_KEY]', process.env.YOUTUBE_API!)
    }

    /**
     * Funtion to return all playlists of related subject 
     */
    private async fetchPlaylists() {
        const playlistsItem = await fetchTemplate(CK_COOKED_PLAYLIST_LIST, this.SEARCH_PLAYLIST_URL)

        return playlistsItem
    }

    /**
     * Funtion to return all videos of related PLAYLIST 
     */
    async fetchPlaylistVideos() {
        // Fetch Playlists
        const fetchedPlaylists = await this.fetchPlaylists()

        // Extract playlist ids from the Playlists
        const playlistIds: string[] = extractPlaylistIds(fetchedPlaylists.items)

        // Make the Video URLS
        const playlistVideoURLS: string[] = playlistIds.map((playlistId: string) => this.makeVideosOfPlaylistURL(playlistId))

        // Fetch all the Videos List
        const vidoesItems = await fetchAllVideosWithRetry(playlistVideoURLS);

        console.log(vidoesItems)
    }
}