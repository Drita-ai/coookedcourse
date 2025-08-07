import React from 'react'

function SubjectInput({ subject, setSubject }) {
    return (
        <div className="mb-6">
            <label htmlFor="subject" className="block text-lg font-medium text-neutral-300 mb-2">
                Course Subject
            </label>
            <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Quantum Physics"
                required
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 px-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-300"
            />
        </div>
    )
}

export default SubjectInput