import React, { useState, useEffect } from 'react';
import { FaBahai, FaBacon } from "react-icons/fa6";
import { FaHome } from 'react-icons/fa';

const navItems = [
    { icon: <FaHome />, label: 'Home' },
    { icon: <FaBacon />, label: 'Profile' },
    { icon: <FaBahai />, label: 'Settings' },
];

function LeftFloatingBox() {
    const [loaded, setLoaded] = useState(false);
    const [active, setActive] = useState(0);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
    }, []);

    return (
        <div
            className={`
            fixed left-0 top-1/4
            h-1/2 w-20
            bg-black/90 backdrop-blur-lg border-r border-white/10
            text-white rounded-r-3xl shadow-xl
            flex flex-col items-center justify-around
            transition-all duration-700 ease-out
            ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
        `}
        >
            {navItems.map((item, index) => (
                <div
                    key={index}
                    className="relative flex items-center justify-center w-full"
                    onClick={() => setActive(index)}
                >
                    {/* Active indicator */}
                    <div className={`absolute left-0 h-10 w-1 rounded-r bg-cyan-400 transition-all ${active === index ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Icon button becomes the hover group */}
                    <div className="group relative">
                        <div
                            className={`m-2 p-3 rounded-xl transition-all duration-300 cursor-pointer 
                                hover:bg-white/10 hover:shadow-md hover:scale-110 
                                ${active === index ? 'bg-white/10 scale-110' : ''}`}
                        >
                            {item.icon}
                        </div>

                        {/* Tooltip now only on icon hover */}
                        <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 whitespace-nowrap z-10">
                            {item.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LeftFloatingBox;
