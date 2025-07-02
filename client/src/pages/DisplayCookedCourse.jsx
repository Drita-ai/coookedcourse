import React from 'react'

import CookedCourseHeader from '../components/DisplayCookedCourse/CookedCourseHeader'
import CookedCourseBody from '../components/DisplayCookedCourse/CookedCourseBody'
import LeftFloatingBox from '../components/LeftFloatingBox'

function DisplayCookedCourse() {
    return (
        <div className='py-10 px-50'>
            <LeftFloatingBox />

            {/* Header for Searched Course */}
            <CookedCourseHeader />

            {/* Body for Searched Course */}
            <CookedCourseBody />
        </div>
    )
}

export default DisplayCookedCourse