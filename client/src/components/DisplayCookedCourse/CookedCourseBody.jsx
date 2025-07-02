import React, { useEffect } from 'react'
import { useSearchedItems } from '../../contexts/SearchedItemsContext'

import SearchedItemSkeleton from '../SearchedItemSkeleton'
import CookedCourseItemCard from './CookedCourseItemCard'

/* Text Placeholder
    < div className = "space-y-4 animate-pulse" >
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div >
*/

function CookedCourseBody() {
    const { fetchVideosAndPlaylists, searchedItems, isLoading } = useSearchedItems()

    useEffect(function () {
        fetchVideosAndPlaylists()
    }, [])

    console.log(searchedItems, isLoading)

    if (isLoading) return <SearchedItemSkeleton />

    return (
        <div className='my-10'>
            {searchedItems.length > 0 && searchedItems.map((item) =>
                <CookedCourseItemCard url={item.snippet.thumbnails.high.url} id={item.id.videoId || item.id.playlistId} />
            )}
        </div>
    )
}

export default CookedCourseBody