import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import Card from './Card/Card'
import { Clock, PlayCircle } from 'lucide-react';

function CookedCourseCardComponent({ playlist }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 h-[300px]"
        >
            <Card
                className="h-full w-full bg-slate-900 border-slate-800 rounded-2xl overflow-hidden cursor-pointer group relative"
            >
                <img
                    src='https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDh4aTFidHVtb2Fta2I1Z291a3Y0N280YXFpMnNwemtqOTNpZHJwNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BXa2alBjrCXC/giphy.gif'
                    alt={`${playlist.collegeName} thumbnail`}
                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 ease-in-out"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/FF0000/FFFFFF?text=Error'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{playlist.collegeName}</h3>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center text-sm bg-slate-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{playlist.totalMatchedVideos} Videos</span>
                        </div>
                        <button className="flex items-center gap-2 text-blue-400 font-semibold">
                            <PlayCircle className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CookedCourseCardComponent;