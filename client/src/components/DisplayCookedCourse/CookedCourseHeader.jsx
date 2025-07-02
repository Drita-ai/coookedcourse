import React from 'react'
import { useLocation } from 'react-router-dom'

function CookedCourseHeader() {
    // Retrieving Syllabus
    const { state } = useLocation();
    const { syllabus } = state;

    return (
        <div className="custom-glow">
            <div className="animate-shine">
                Displaying courses for {syllabus}
            </div>
        </div>
    )
}

export default CookedCourseHeader