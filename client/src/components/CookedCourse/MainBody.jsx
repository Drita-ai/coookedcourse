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

        const courseData = {
            subject,
            syllabus,
            client: "0c458858-4cff-46ab-a8ec-5ae97c511668"
        };
        console.log(courseData)
        try {
            const apiData = await generateCourse(courseData);
            navigate('/display-cooked-course', { state: { course: apiData } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="bg-neutral-950/60 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-900/10">
            <form onSubmit={handleSubmit}>
                {/* Subject Input Box */}
                <SubjectInput subject={subject} onSetSubject={setSubject} />

                {/* Unit Input Box */}
                <div className="mb-4">
                    <h2 className="text-lg font-medium text-neutral-300 mb-3">Syllabus Units</h2>
                    <div className="space-y-4">
                        <SyllabusInput onUnitChange={handleUnitChange}
                            onRemoveUnit={removeUnit}
                            units={units} />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={addUnit}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Unit
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto flex-grow bg-gradient-to-r from-teal-600 to-blue-900 cursor-pointer text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Course'}
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