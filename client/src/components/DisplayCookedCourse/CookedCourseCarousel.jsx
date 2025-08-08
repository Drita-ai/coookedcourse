import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CookedCourseCardComponent from './CookedCourseCardComponent';

function CookedCourseCarousel({ title, courses, onCourseSelect }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-6 mb-16">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-100">{title}</h2>
                <div className="hidden md:flex items-center gap-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-slate-300"><ChevronLeft size={20} /></button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-slate-300"><ChevronRight size={20} /></button>
                </div>
            </div>
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {courses.map(course => (
                    <CookedCourseCardComponent key={course.id} course={course} onSelect={onCourseSelect} />
                ))}
            </div>
        </div>
    );
};

export default CookedCourseCarousel