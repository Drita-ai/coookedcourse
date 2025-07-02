import React, { useState, useEffect } from 'react'
import { FaBahai, FaBacon } from "react-icons/fa6";
import { FaHome } from 'react-icons/fa'

const navItems = [
    { icon: <FaHome />, label: 'Home' },
    { icon: <FaBacon />, label: 'Profile' },
    { icon: <FaBahai />, label: 'Settings' },
];

function LeftFloatingBox() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setLoaded(true), 100);
    }, []);

    return (
        <div
            className={`
        fixed left-0 top-1/4
        h-1/2 w-20
        bg-gray-900 text-white shadow-lg
        rounded-r-2xl flex flex-col items-center justify-around
        transition-all duration-700 ease-out
        ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
      `}
        >
            {navItems.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex items-center justify-center p-3 rounded-xl hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                >
                    {item.icon}
                    <span className="absolute left-20 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default LeftFloatingBox