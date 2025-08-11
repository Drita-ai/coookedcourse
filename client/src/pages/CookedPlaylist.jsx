import React, { useState, useMemo, useEffect } from 'react';
import TopicRow from '../components/CookedPlaylist/TopicRow';
import Navbar from '../components/Navbar';
import { generateCourse } from '../services/generateCourse';

export default function CookedPlaylist() {
    const [activeTopicId, setActiveTopicId] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        const courseData = {
            subject: {},
            syllabus: [],
            client: "0c458858-4cff-46ab-a8ec-5ae97c511668"
        };

        async function fetchPlaylists() {
            try {
                const res = await generateCourse(courseData);
                if (res.message === 'success') {
                    setApiData(res.data)
                    setIsLoading(false)
                }
            } catch (err) {
                console.error(err)
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPlaylists()
    }, []);

    const course = useMemo(() => {
        if (!apiData) return null;

        const sourceData = apiData[0];
        const cleanUnits = sourceData.units.map((unitObj, unitIndex) => {
            const unitName = Object.keys(unitObj)[0];
            const topicsArray = unitObj[unitName];
            const cleanTopics = topicsArray.map((topicObj, topicIndex) => {
                const topicName = Object.keys(topicObj)[0];
                return {
                    id: `u${unitIndex}-t${topicIndex}`,
                    name: topicName,
                    details: topicObj[topicName]
                };
            });
            return { id: `unit-${unitIndex}`, name: unitName, topics: cleanTopics };
        });

        return {
            creatorName: sourceData.collegeName,
            coverage: sourceData.overallCoverage,
            videoCount: sourceData.totalMatchedVideos,
            units: cleanUnits
        };
    }, [apiData]);

    console.log(course)

    const handleToggleTopic = (topicId) => {
        setActiveTopicId(prevId => (prevId === topicId ? null : topicId));
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="max-w-3xl mx-auto pb-12 px-4">
                <Navbar />

                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-700">Cooked Playlist</h1>
                    <p className="text-md text-slate-500 mt-1"></p>
                </header>

                <main className="space-y-8">
                    {course && course.units.map(unit => (
                        <section key={unit.id}>
                            <h2 className="text-sm font-bold uppercase text-slate-400 px-1 mb-3">{unit.name}</h2>
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {unit.topics.map(topic => (
                                    <TopicRow
                                        key={topic.id}
                                        topic={topic}
                                        isActive={activeTopicId === topic.id}
                                        onToggle={() => handleToggleTopic(topic.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </main>
            </div>
        </div>
    );
}

