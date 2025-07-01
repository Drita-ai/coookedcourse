import React from 'react'
import { useLocation } from 'react-router-dom'

function DisplayCookedCourse() {
    // Retrieving Syllabus
    const { state } = useLocation();
    const { syllabus } = state;

    return (
        <div className='py-10 px-50'>
            <div className="custom-glow">
                <div className="animate-shine">
                    Displaying courses for {syllabus}
                </div>
            </div>
        </div>
    )
}

export default DisplayCookedCourse