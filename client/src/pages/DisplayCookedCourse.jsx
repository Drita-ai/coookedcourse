import { useState, useEffect } from "react";

import { generateCourse } from '../services/generateCourse';
import { normalizePlaylists } from '../services/utils';

import VideoInsight from '../components/CookedPlaylist/VideoInsight';
import PlaylistsViewerSidebar from '../components/CookedPlaylist/PlylistsViewerSidebar';
import PlaylistViewerHeader from '../components/CookedPlaylist/PlaylistViewerHeader';

export default function DisplayCookedCourse() {
    const [playlists, setPlaylists] = useState([]);
    const [status, setStatus] = useState("loading");
    const [activePlaylist, setActivePlaylist] = useState(0);
    const [activeSelection, setActiveSelection] = useState({
        unitIndex: 0,
        topicIndex: 0,
    });
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                setStatus("loading");

                const courseData = {
                    subject: {},
                    syllabus: [],
                    client: "0c458858-4cff-46ab-a8ec-5ae97c511668",
                };

                const res = await generateCourse(courseData);
                console.log(res.data)
                if (res.message === "success") {
                    const normalizedData = normalizePlaylists(
                        res.data
                    );

                    setPlaylists(normalizedData);
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

    const currentPlaylist =
        playlists[activePlaylist];

    const currentUnit =
        currentPlaylist?.units?.[
        activeSelection.unitIndex
        ];

    const currentTopic =
        currentUnit?.topics?.[
        activeSelection.topicIndex
        ];

    const videos =
        currentTopic?.matchedVideos || [];

    function handlePlaylistSelect(index) {
        setActivePlaylist(index);
        setActiveSelection({
            unitIndex: 0,
            topicIndex: 0,
        });

        setSelectedVideo(null);
    }

    function handleTopicSelect(
        unitIndex,
        topicIndex
    ) {
        setActiveSelection({
            unitIndex,
            topicIndex,
        });

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
                currentPlaylist={currentPlaylist}
                activeSelection={activeSelection}
                onTopicSelect={handleTopicSelect}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                <PlaylistViewerHeader
                    playlists={playlists}
                    onPlaylistSelect={handlePlaylistSelect}
                    activePlaylist={activePlaylist}
                />

                <div className="flex-1 relative overflow-hidden">
                    <div className="h-full overflow-y-auto px-5 py-5">

                        <div className="flex items-baseline gap-2 mb-6">
                            <h2 className="text-sm font-medium">
                                {
                                    currentTopic?.topicName
                                }
                            </h2>

                            <span className="text-xs text-slate-400">
                                {videos.length} videos
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {videos.map(
                                (video, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 py-4 cursor-pointer group"
                                        onClick={() =>
                                            setSelectedVideo(
                                                video
                                            )
                                        }
                                    >
                                        <div className="w-16 h-10 shrink-0 bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" >
                                                <polygon
                                                    points="0,0 10,6 0,12" fill="#d4d4d8"
                                                />
                                            </svg>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors mb-1 leading-snug">
                                                {video}
                                            </p>

                                            <p className="text-[11px] text-slate-400 mb-2">
                                                10 mins
                                            </p>

                                            <button
                                                className="text-[11px] text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                                                onClick={(e) => { e.stopPropagation(); setSelectedVideo(video); }}
                                            >
                                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                    <circle cx="5.5" cy="5.5" r="4.5" />
                                                    <path
                                                        d="M5.5 3.5v2.5M5.5 7.5v.2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>

                                                Why this?
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    {selectedVideo && (
                        <VideoInsight
                            video={selectedVideo}
                            onClose={() =>
                                setSelectedVideo(
                                    null
                                )
                            }
                        />
                    )}
                </div>
            </main>
        </div>
    );
}