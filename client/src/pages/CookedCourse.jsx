import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

function CookedCourse() {
    return (
        <div className='h-screen w-full pl-[12em] pt-[10em] pb-[4em] pr-[5em]'>
            <div>
                {/* TO-DO: Why margin to the Left? */}
                <p className='p-main inline m-0'>Hi there,</p>

                <p className='text-xl ml-2'>What would you like to learn today?</p>

                <div className='relative'>
                    <textarea id='' cols='100' rows='6' placeholder='Tailor your course...' className='resize-none p-3 mt-10 border rounded-xl'></textarea>
                    <button className='btn-search absolute bottom-5 right-30'>
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CookedCourse