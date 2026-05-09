import { useNavigate } from 'react-router-dom';

import Header from '../components/CookedCourse/Header';
import MainBody from '../components/CookedCourse/MainBody';
import { BiArrowBack } from "react-icons/bi";

function CookedCourse() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 font-sans text-slate-900">
            <div className="w-full max-w-2xl relative">
                <div className="absolute -top-2 left-">
                    <button
                        onClick={() => navigate('/')}
                        className="hover:cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 hover:text-slate-900 transition-all group"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">
                            <BiArrowBack />
                        </span>
                        Back to Home
                    </button>
                </div>

                <Header />

                <MainBody />

                <footer className="text-center mt-20 text-slate-600 text-[10px] uppercase tracking-[0.4em] font-medium">
                    &copy; COOKEDCOURSE
                </footer>
            </div>
        </div>
    );
}

export default CookedCourse
