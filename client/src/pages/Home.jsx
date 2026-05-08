import { useNavigate } from 'react-router-dom';

import { PiCookingPotDuotone } from "react-icons/pi";
import { FaPlayCircle } from "react-icons/fa";


const Home = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate("/app")
    };

    return (
        <div className="w-full h-[100vh] flex flex-col overflow-hidden relative">
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-max z-50">
                <div className="flex items-center bg-white/70 backdrop-blur-xl rounded-full p-1.5 pl-5 gap-10 border border-white/40 ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <div className="relative w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gray-900 shadow-sm">
                                <PiCookingPotDuotone className='w-4.5 h-4.5 text-white' />
                            </div>
                        </div>
                        <span className="font-bold text-sm tracking-[-0.02em] text-zinc-800">
                            CookedCourse
                        </span>
                    </div>

                    <div className="flex items-center">
                        <button className="relative group overflow-hidden bg-zinc-900 text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-300 hover:bg-gray-800 hover:cursor-pointer active:scale-95">
                            <span className="relative z-10" onClick={handleStartClick}>Try it</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight max-w-4xl">
                    Your Syllabus. Your Pace. <br />
                    <span className="bg-[#FFD600] px-4 rounded-xl">Your Playlist.</span>
                </h1>

                <p className="mt-8 text-gray-500 text-lg md:text-xl max-w-xl font-medium">
                    Turn any course syllabus into a structured YouTube learning path.
                    Automate your study schedule with curated video units.
                </p>

                <button
                    onClick={handleStartClick}
                    className="mt-10 bg-black text-white px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-gray hover:bg-gray-800 hover:-translate-y-1 transition-all flex items-center"
                >
                    Create Playlist <FaPlayCircle className='ml-2 h-6 w-6' />
                </button>

                <div className="hidden lg:block absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-10 animate-bounce transition-all duration-1000">
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 rotate-[-12deg]">
                            <div className="w-10 h-1.5 bg-red-400 rounded-full mb-2"></div>
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/4 left-20">
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 rotate-[8deg]">
                            <div className="flex gap-1 mb-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                            </div>
                            <div className="w-20 h-1.5 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/3 right-12">
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 rotate-[15deg]">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 font-bold">DSA</div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/3 right-24">
                        <div className="bg-white p-5 rounded-2xl shadow-2xl border border-gray-50 rotate-[-5deg]">
                            <div className="w-24 h-2 bg-purple-100 rounded-full mb-2"></div>
                            <div className="w-16 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="pb-10 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                    &copy; cookedcourse
                </p>
            </div>
        </div>
    );
};

export default Home;