import React, { useState } from 'react'
import SubjectInput from './InputsBox/SubjectInput';
import SyllabusInput from './InputsBox/SyllabusInput';
import Spinner from '../Spinner';
import { useNavigate } from 'react-router-dom';
import { generateCourse } from '../../services/generateCourse';

// SVG Icon for the Trash Can
const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

// SVG Icon for the Plus Symbol
const PlusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

function MainBody() {
    const navigate = useNavigate();

    // State to hold the course subject
    const [subject, setSubject] = useState('');

    // State to show a confirmation message after generation
    const [isGenerated, setIsGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // State to hold the list of units. Each unit is an object with an id, name, and topics.
    // We start with one empty unit by default.
    const [units, setUnits] = useState([{ id: 1, name: '', topics: '' }]);

    // Error
    const [error, setError] = useState(null)

    const handleUnitChange = (id, event) => {
        const { name, value } = event.target;
        setUnits(currentUnits =>
            currentUnits.map(unit =>
                unit.id === id ? { ...unit, [name]: value } : unit
            )
        );
    };

    const addUnit = () => {
        setUnits([...units, { id: Date.now(), name: '', topics: '' }]);
    };

    const removeUnit = (id) => {
        if (units.length > 1) {
            setUnits(units.filter(unit => unit.id !== id));
        }
    };

    // On submit -> Generate Course
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Extract Units and Syllabus
        const syllabus = units.map(unit => ({
            id: unit.id,
            unit: unit.name,
            topics: unit.topics
        }));

        // TODO: Get Client Properly 
        const courseData = {
            subject,
            syllabus,
            client: "0c458858-4cff-46ab-a8ec-5ae97c511668"
        };

        try {
            // TODO: Get Generated Playlist Id
            setIsLoading(false)
            // Then, navigate
            navigate(`/display-cooked-course/0c458858-4cff-46ab-a8ec-5ae97c511668`, { state: { data: courseData } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="bg-violet-200 backdrop-blur-xl border border-neutral-300 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/10">
            <form onSubmit={handleSubmit}>
                {/* Subject Input Box */}
                <SubjectInput subject={subject} onSetSubject={setSubject} />

                {/* Unit Input Box */}
                <div className="mb-4">
                    <div className="space-y-4">
                        <SyllabusInput onUnitChange={handleUnitChange}
                            onRemoveUnit={removeUnit}
                            units={units} />
                    </div>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <button
                        type="button"
                        onClick={addUnit}
                        className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-600 transition-all"
                    >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-100 group-hover:border-slate-400 transition-colors">
                            <PlusIcon className="w-3 h-3" />
                        </span>
                        Add another unit
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-slate-600 hover:bg-slate-700 hover:cursor-pointer text-white px-12 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-30"
                    >
                        {isLoading ? 'Processing' : 'Generate Course'}
                    </button>
                </div>

                {isLoading && (<Spinner />)}

                {/* Submission Confirmation Message */}
                {/* {isGenerated && (
                    <div className="mt-6 text-center text-green-400 bg-green-900/50 border border-green-700 rounded-lg p-3 animate-fade-in">
                    </div>
                )} */}
            </form>
        </div>
    )
}

export default MainBody