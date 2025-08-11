import { Tally1 } from 'lucide-react';

const YouTubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.07v3.86a1 1 0 001.555.832l3.197-1.933a1 1 0 000-1.664L9.555 7.168z" clipRule="evenodd" /></svg>;

export default function TopicDetailView({ details }) {
    return (
        <div className="py-4 px-2 space-y-4 bg-slate-50 rounded-lg">
            {details.matchedSyllabusTopics.items.map((syllabusItem, index) => (
                <div key={index} className="pb-3 border-b border-slate-200 last:border-b-0">
                    <div className="flex items-start mb-2">
                        <Tally1 className='text-slate-300 ' />
                        <p className="text-sm text-slate-800">{syllabusItem}</p>
                    </div>
                    <div className="flex items-start gap-3 pl-3">
                        <YouTubeIcon />
                        <p className="text-sm text-slate-600">
                            {details.matchedYoutubeTitles.items[index] || <span className="italic text-slate-400">N/A</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
};
