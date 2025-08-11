import TopicDetailView from './TopicDetailView';

const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${className}`}><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>;

export default function TopicRow({ topic, isActive, onToggle }) {
    const matchedCount = topic.details.matchedSyllabusTopics.count;
    const unmatchedCount = topic.details.unmatchedSyllabusTopics.count;
    const totalCount = matchedCount + unmatchedCount;
    const coverage = totalCount > 0 ? (matchedCount / totalCount) * 100 : 0;

    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <div onClick={onToggle} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
                <p className="font-semibold text-slate-800">{topic.name}</p>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-blue-600">{coverage.toFixed(0)}%</p>
                    <ChevronDownIcon className={isActive ? 'rotate-180' : ''} />
                </div>
            </div>
            <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden px-4 pb-4">
                    <TopicDetailView details={topic.details} />
                </div>
            </div>
        </div>
    );
};
