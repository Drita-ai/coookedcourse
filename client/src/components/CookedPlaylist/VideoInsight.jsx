import { useEffect } from 'react';

export default function VideoInsight({ video, onClose }) {
    useEffect(() => {
        const fn = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [onClose]);

    return (
        <div className="absolute inset-0 z-10" onClick={onClose}>
            <aside
                className="absolute top-0 right-0 h-full w-64 bg-white border-l border-slate-100 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-4 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">
                            Why this video?
                        </p>
                        <p className="text-xs font-medium text-slate-900 leading-snug">
                            {video.title}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 mt-0.5"
                        aria-label="Close panel"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M1 1l12 12M13 1L1 13" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed">{video.insight}</p>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { val: `${video.coveragePct}%`, label: "Coverage" },
                            { val: video.duration, label: "Duration" },
                        ].map(({ val, label }) => (
                            <div key={label} className="bg-slate-50 rounded-lg p-3">
                                <div className="text-base font-medium text-slate-900">{val}</div>
                                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">
                            Key moments
                        </p>
                        <div className="divide-y divide-slate-100">
                            {video.timestamps.map((ts) => (
                                <div
                                    key={ts.t}
                                    className="flex items-center gap-3 py-2.5 cursor-pointer group"
                                >
                                    <span className="font-mono text-[11px] text-slate-900 w-8 shrink-0">
                                        {ts.t}
                                    </span>
                                    <span className="text-xs text-slate-500 flex-1">{ts.label}</span>
                                    <svg
                                        className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors"
                                        viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    >
                                        <path d="M2 6h8M7 3l3 3-3 3" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}