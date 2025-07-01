import React from 'react'
import SearchBox from '../components/CookedCourse/SearchBox';

function CookedCourse() {
    return (
        <div className='h-screen w-full pl-[12em] pt-[10em] pb-[4em] pr-[5em]'>
            <div>
                {/* TO-DO: Why margin to the Left? */}
                <p className='p-main inline m-0'>Hi there,</p>

                <p className='text-xl ml-2'>What would you like to learn today?</p>

                <SearchBox />
            </div>
        </div>
    )
}

export default CookedCourse