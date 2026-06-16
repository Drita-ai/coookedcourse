import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

import VideoInsight from '../components/CookedPlaylist/VideoInsight';
import PlaylistsViewerSidebar from '../components/CookedPlaylist/PlylistsViewerSidebar';
import PlaylistViewerHeader from '../components/CookedPlaylist/PlaylistViewerHeader';
import { generateCourse } from '../services/generateCourse';

export default function DisplayCookedCourse() {
    const [navChapters, setNavChapters] = useState([]);
    const [channels, setChannels] = useState([]);
    const [analysisMap, setAnalysisMap] = useState({});
    const [status, setStatus] = useState("loading");
    const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const courseDataToPost = useLocation().state;

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                setStatus("loading");

                const res = await generateCourse(courseDataToPost.data);
                const responseData = res.data ? res.data : res;

                if (responseData.message === "success") {
                    setNavChapters(responseData.navChapters || []);
                    setChannels(responseData.channels || []);
                    setAnalysisMap(responseData.analysisMap || {});
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        }

        fetchPlaylists();
    }, []);

    const currentChannel = channels[activePlaylistIndex] || "";
    const currentChapter = navChapters[activeChapterIndex] || null;

    // Extract data node matching current selection
    const currentAnalysis = (currentChannel && currentChapter)
        ? analysisMap[currentChannel]?.[currentChapter.id]
        : null;

    const rawVideos = currentAnalysis?.videos || [];
    const rawFallbackVideos = currentAnalysis?.fallbackVideos || []; // unmatched topics

    // Data expected by VideoInsight
    const videos = rawVideos.map((video) => ({
        id: video.ytVideoId,
        title: video.ytVideoTitle,
        insight: `This video directly addresses core items under ${currentChapter?.name}. Covered topics: ${(currentAnalysis?.matchedSyllabusTopics || []).slice(0, 2).join(', ')}.`,
        coveragePct: currentAnalysis?.unitCoveragePercentage || 0,
        duration: "10 mins",
        timestamps: [
            { t: "0:00", label: "Topic Introduction" },
            { t: "4:30", label: "Core Core Concept & Example Walkthrough" }
        ]
    }));

    const fallbackVideos = rawFallbackVideos.map((video) => ({
        id: video.ytVideoId,
        title: video.ytVideoTitle,
        topicName: video.topicName,
        insight: `Automated dynamic recovery video brought in to fully cover the missed syllabus topic: "${video.topicName}".`,
        coveragePct: 100, // Explicit single target topic resolution
        duration: "Quick Study",
        isFallback: true,
        timestamps: [
            { t: "0:00", label: `Explaining ${video.topicName}` }
        ]
    }));

    const adaptedPlaylists = channels.map((channel) => {
        let cumulativeCoverage = 0;
        navChapters.forEach((ch) => {
            cumulativeCoverage += analysisMap[channel]?.[ch.id]?.unitCoveragePercentage || 0;
        });

        return {
            collegeName: channel,
            overallCoverage: navChapters.length ? Math.round(cumulativeCoverage / navChapters.length) : 0
        };
    });

    const adaptedCurrentPlaylist = {
        units: navChapters.map((chapter) => ({
            id: chapter.id,
            unitName: chapter.name,
            topics: [{ id: chapter.id, topicName: `${chapter.name} Overview` }]
        }))
    };

    const adaptedActiveSelection = {
        unitIndex: activeChapterIndex,
        topicIndex: 0
    };

    function handlePlaylistSelect(index) {
        setActivePlaylistIndex(index);
        setActiveChapterIndex(0);
        setSelectedVideo(null);
    }

    function handleTopicSelect(unitIndex) {
        setActiveChapterIndex(unitIndex);
        setSelectedVideo(null);
    }

    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center text-sm text-slate-500">
                Loading playlists...
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="h-screen flex items-center justify-center text-sm text-red-500">
                Failed to load playlists.
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white font-mono text-slate-900">
            <PlaylistsViewerSidebar
                currentPlaylist={adaptedCurrentPlaylist}
                activeSelection={adaptedActiveSelection}
                onTopicSelect={(unitIndex, _) => handleTopicSelect(unitIndex)}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <PlaylistViewerHeader
                    playlists={adaptedPlaylists}
                    onPlaylistSelect={handlePlaylistSelect}
                    activePlaylist={activePlaylistIndex}
                />

                <div className="flex-1 relative overflow-hidden">
                    <div className="h-full overflow-y-auto px-5 py-5">

                        <div className="flex items-baseline gap-2 mb-6">
                            <h2 className="text-sm font-medium">
                                {currentChapter?.name} Overview
                            </h2>

                            <span className="text-xs text-slate-400">
                                {videos.length} core videos {fallbackVideos.length > 0 && `+ ${fallbackVideos.length} fallback additions`}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    className="flex items-start gap-3 py-4 cursor-pointer group"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <div className="w-16 h-10 shrink-0 bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" >
                                            <polygon points="0,0 10,6 0,12" fill="#d4d4d8" />
                                        </svg>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors mb-1 leading-snug">
                                            {video.title}
                                        </p>

                                        <p className="text-[11px] text-slate-400 mb-2">
                                            {video.duration}
                                        </p>

                                        <button
                                            className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVideo(video);
                                            }}
                                        >
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                <circle cx="5.5" cy="5.5" r="4.5" />
                                                <path d="M5.5 3.5v2.5M5.5 7.5v.2" strokeLinecap="round" />
                                            </svg>
                                            Why this?
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {fallbackVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className="flex items-start gap-3 py-4 cursor-pointer group"
                                    onClick={() => setSelectedVideo(video)}
                                >
                                    <div className="w-16 h-10 shrink-0 bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                                        <svg width="10" height="12" viewBox="0 0 10 12" fill="none" >
                                            <polygon points="0,0 10,6 0,12" fill="#d4d4d8" />
                                        </svg>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors mb-1 leading-snug">
                                            {video.title}
                                        </p>

                                        <p className="text-[11px] text-slate-400 mb-2">
                                            {video.duration}
                                        </p>

                                        <button
                                            className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVideo(video);
                                            }}
                                        >
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                <circle cx="5.5" cy="5.5" r="4.5" />
                                                <path d="M5.5 3.5v2.5M5.5 7.5v.2" strokeLinecap="round" />
                                            </svg>
                                            Why this?
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {videos.length === 0 && (
                                <div className="text-xs text-slate-400 py-6 text-center">
                                    No matched videos found for this chapter.
                                </div>
                            )}
                        </div>
                    </div>
                    {selectedVideo && (
                        <VideoInsight
                            video={selectedVideo}
                            onClose={() => setSelectedVideo(null)}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}