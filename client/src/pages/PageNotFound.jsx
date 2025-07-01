import React from 'react'
import { FaFaceRollingEyes } from "react-icons/fa6";

function PageNotFound() {
    return (
        <div className='h-screen w-full flex items-center justify-center flex-row'>
            <p className='text-3xl'>Page Not Found</p>
            <FaFaceRollingEyes className='text-2xl ml-2' />
        </div>
    )
}

export default PageNotFound