import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skeleton from './Card/Skeleton';
import CookedCourseCarousel from './CookedCourseCarousel';

const MOCK_COURSES = [
    {
        id: 'PLDoPjvoNmBAx3kiGCQZGRAx_BIQzs3vBv',
        title: 'React for Beginners',
        category: 'Frontend Development',
        channel: 'freeCodeCamp.org',
        videoCount: 38,
        thumbnailUrl: 'https://placehold.co/600x400/020617/38bdf8?text=React',
        description: 'A comprehensive introduction to the React framework, covering hooks, state, and props.'
    },
    {
        id: 'PLu0W_9lII9agx66oZnT6IyhcRIbWE7Z2v',
        title: 'JavaScript Mastery',
        category: 'Frontend Development',
        channel: 'CodeWithHarry',
        videoCount: 115,
        thumbnailUrl: 'https://placehold.co/600x400/020617/facc15?text=JavaScript',
        description: 'Deep dive into JavaScript, from the basics to advanced concepts like closures and async/await.'
    },
    {
        id: 'PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwcpi7',
        title: 'Modern CSS In-Depth',
        category: 'Frontend Development',
        channel: 'The Net Ninja',
        videoCount: 22,
        thumbnailUrl: 'https://placehold.co/600x400/020617/6366f1?text=CSS',
        description: 'Explore modern CSS features including Flexbox, Grid, and custom properties for stunning layouts.'
    },
    {
        id: 'PL-J2q3Ga50oMQa1JdS_4oNjG6_r-vC4rR',
        title: 'UI/UX Design Crash Course',
        category: 'Design Principles',
        channel: 'Mizko',
        videoCount: 12,
        thumbnailUrl: 'https://placehold.co/600x400/020617/ec4899?text=UI/UX',
        description: 'Learn the fundamentals of user interface and user experience design to create intuitive products.'
    },
    {
        id: 'PLd3UqWTnYXOmx_J1774ukG_r26GvW_rA6',
        title: 'Node.js & Express',
        category: 'Backend Development',
        channel: 'Dave Gray',
        videoCount: 12,
        thumbnailUrl: 'https://placehold.co/600x400/020617/22c55e?text=Node.js',
        description: 'Create and deploy production-ready REST APIs with the most popular backend JavaScript runtime.'
    },
    {
        id: 'PLgUwDviBJo_q_d87aI2i19y2a3R6I4q4g',
        title: 'Data Structures & Algorithms',
        category: 'Computer Science',
        channel: 'takeUforward',
        videoCount: 195,
        thumbnailUrl: 'https://placehold.co/600x400/020617/f97316?text=DSA',
        description: 'Master essential data structures and algorithms to excel in coding interviews and problem-solving.'
    }
];

const fetchCuratedPlaylists = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(MOCK_COURSES);
        }, 1500);
    });
};

function CookedCourseBody({ onCourseSelect }) {
    const [courses, setCourses] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus('loading');
        fetchCuratedPlaylists()
            .then(data => {
                setCourses(data);
                setStatus('success');
            })
            .catch(error => {
                console.error(error);
                setStatus('error');
            });
    }, []);

    const coursesByCategory = courses.reduce((acc, course) => {
        (acc[course.category] = acc[course.category] || []).push(course);
        return acc;
    }, {});

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-20"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-100 mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                    Curated Learning Paths
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                    Skip the noise. Dive into expert-led courses from YouTube, organized for a seamless learning experience.
                </p>
            </motion.div>

            {status === 'loading' && (
                <div className="space-y-16">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-6">
                            <Skeleton className="h-8 w-1/4" />
                            <div className="flex gap-6 overflow-hidden">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <Skeleton key={j} className="flex-shrink-0 w-[300px] h-[420px] rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === 'success' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                    {Object.entries(coursesByCategory).map(([category, courses]) => (
                        <CookedCourseCarousel key={category} title={category} courses={courses} onCourseSelect={onCourseSelect} />
                    ))}
                </motion.div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center justify-center text-center text-red-400 bg-red-900/20 border border-red-800 rounded-2xl p-12">
                    <ServerCrash className="w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Something Went Wrong</h2>
                    <p className="text-red-300">We couldn't load the courses. Please try refreshing the page.</p>
                </div>
            )}
        </div>
    );
};


export default CookedCourseBody