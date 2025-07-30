import { getRedisClient } from './getRedisClient'
import axios from 'axios';

import { CK_COOKED_PLAYLIST_LIST } from '../../constants/constants';

export const checkInCacheAndSet = async (key: string, URL: string) => {
    /**
     * TODO: Better redis keys CHECK 
     */
    const client = await getRedisClient();

    // Check the API Response in Cache
    if (!(await client.get(key))) {
        // Fetch the Playlist List
        const response = await axios.get(URL)

        // Store it's result in cache
        await client.set(key, JSON.stringify(response!.data))
    }
}

export const fetchTemplate = async (cacheKey: string, URL: string) => {
    let playlistsItem;

    try {
        const client = await getRedisClient()

        // Check the KEY in cache, if not exists SET the KEY and VALUE
        await checkInCacheAndSet(cacheKey, URL)

        // Get the PLAYLISTS LIST from cache
        playlistsItem = JSON.parse((await client.get(cacheKey))!)
    } catch (err) {
        console.log(err)
    }

    return playlistsItem
}

