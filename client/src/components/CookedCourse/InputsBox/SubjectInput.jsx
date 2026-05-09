function SubjectInput({ subject, onSetSubject }) {
    return (
        <div className="mb-8">
            <label className="block text-[12px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2 ml-1">
                Course Name
            </label>
            <input
                type="text"
                value={subject}
                onChange={(e) => onSetSubject(e.target.value)}
                placeholder="e.g. Data Structure and Algorithm"
                required
                className="w-full bg-slate-50/50 border border-transparent rounded-2xl py-3 px-8 text-lg font-light text-slate-500 placeholder:text-slate-400 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all duration-300"
            />
        </div>
    );
}

export default SubjectInput