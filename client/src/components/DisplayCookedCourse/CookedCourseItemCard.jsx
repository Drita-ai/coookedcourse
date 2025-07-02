import React from 'react'

function CookedCourseItemCard({ url, id }) {
    return (
        <div className="flex w-full rounded-md overflow-hidden py-4" key={id}>
            <div className='h-[200px] w-1/4'>
                <img src={url} alt="course thumbnail" className='h-full w-full' />
            </div>
            <div className='w-3/4 p-4'>
                <div className='p-2 bg-[#E5E4E2] w-full rounded-xs'>
                    <p>
                        Binary Tree
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CookedCourseItemCard