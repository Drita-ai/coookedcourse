import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FaArrowRightLong } from "react-icons/fa6";

function SearchBox() {
    const [courseQuery, setCourseQuery] = useState("");
    const navigate = useNavigate()

    function handleSearch() {
        navigate("/display-cooked-course", {
            state: {
                syllabus: courseQuery
            }
        })
    }

    return (
        <div className='relative'>
            <textarea
                id='cook-course-box'
                cols='100'
                rows='6'
                placeholder='Tailor your course...'
                className='resize-none p-3 mt-10 border rounded-xl'
                onChange={e => setCourseQuery(e.target.value)}
            ></textarea>

            <button className='btn-search absolute bottom-5 right-30' onClick={handleSearch}>
                <FaArrowRightLong />
            </button>
        </div>
    )
}

export default SearchBox