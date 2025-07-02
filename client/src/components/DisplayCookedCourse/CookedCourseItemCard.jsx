import React from 'react'

function CookedCourseItemCard({ url, id }) {
    return (
        <div className="h-[200px] w-full rounded-md overflow-hidden" key={id}>
            <img src={url} alt="course thumbnail" className='h-full w-full' />
        </div>
    )
}

export default CookedCourseItemCard