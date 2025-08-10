import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skeleton from './Card/Skeleton';
import { ServerCrash } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom'
import { generateCourse } from '../../services/generateCourse';
import CookedCourseCardComponent from './CookedCourseCardComponent';
import NavBar from '../Navbar'

function CookedCourseBody({ onCourseSelect }) {
    const [playlists, setPlaylists] = useState([]);
    const [status, setStatus] = useState('loading');
    const { courseId } = useParams()

    useEffect(() => {
        // TODO: Make GET Request to get playlists from url
        setStatus('loading');

        const courseData = {
            subject: {},
            syllabus: [],
            client: "0c458858-4cff-46ab-a8ec-5ae97c511668"
        };

        async function fetchPlaylists() {
            try {
                const res = await generateCourse(courseData);
                console.log(res)
                if (res.message === 'success') {
                    setPlaylists(res.data)
                    setStatus('success')
                }
            } catch (err) {
                console.error(err)
                setStatus('error')
            }
        }

        fetchPlaylists()
    }, []);

    return (
        <div className="container mx-auto px-4 pb-12">
            <NavBar />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-20"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-100 mb-4 bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-600">
                    Curated Learning Paths
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                    Skip the noise. Dive into expert-led courses from YouTube, organized for a seamless learning experience.
                </p>
            </motion.div>

            {status === 'loading' && (
                <div className="space-y-16">
                    {Array.from({ length: 1 }).map((_, i) => (
                        <div key={i} className="space-y-6">
                            <Skeleton className="h-8 w-1/4" />
                            <div className="flex gap-6 overflow-hidden">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <Skeleton key={j} className="flex-shrink-0 w-[300px] h-[420px] rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {status === 'success' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>

                    <div className="grid grid-cols-3 gap-6 pb-4 items-center self-center">
                        {playlists.map(playlist => (
                            <CookedCourseCardComponent key={playlist.collegeName} playlist={playlist} />
                        ))}
                    </div>
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