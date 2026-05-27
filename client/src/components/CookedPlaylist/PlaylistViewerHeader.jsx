export default function PlaylistViewerHeader({ playlists, onPlaylistSelect, activePlaylist }) {

    return (
        <div className="border-b border-slate-200 px-5 pt-4">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    Matched playlists
                </p>

                <button className="text-[11px] text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded px-2.5 py-1 transition-colors flex items-center gap-1.5">
                    <svg
                        width="12"
                        height="9"
                        viewBox="0 0 20 14"
                        fill="currentColor"
                    >
                        <path d="M19.5 3.5a2.5 2.5 0 00-1.75-1.77C16.25 1.4 10 1.4 10 1.4s-6.25 0-7.75.33A2.5 2.5 0 00.5 3.5 26 26 0 000 7a26 26 0 00.5 3.5A2.5 2.5 0 002.25 12.27C3.75 12.6 10 12.6 10 12.6s6.25 0 7.75-.33a2.5 2.5 0 001.75-1.77A26 26 0 0020 7a26 26 0 00-.5-3.5zM8 9.5V4.5l5 2.5-5 2.5z" />
                    </svg>

                    Save to YouTube
                </button>
            </div>

            <div className="flex overflow-x-auto">
                {playlists.map((playlist, i) => (
                    <button
                        key={i}
                        onClick={() =>
                            onPlaylistSelect(
                                i
                            )
                        }
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 text-xs border-b-[1.5px] transition-colors
                    ${i === activePlaylist
                                ? "border-slate-900 text-slate-900 font-medium"
                                : "border-transparent text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {playlist.collegeName}

                        <span className="text-[10px] text-slate-400">
                            {Math.round(
                                playlist.overallCoverage
                            )}
                            %
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}