import React from 'react'

function SearchedItemSkeleton() {
    return (
        <div className='grid grid-cols-3 gap-4 my-10'>
            <div className="bg-gray-300 h-[200px] w-full animate-pulse rounded-md"></div>
        </div>
    )
}

export default SearchedItemSkeleton