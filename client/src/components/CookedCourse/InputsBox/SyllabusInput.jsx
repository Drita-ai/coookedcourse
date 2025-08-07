import React from 'react'

function SyllabusInput({ units, onRemoveUnit, onUnitChange }) {


    return (
        <>{
            units.map((unit, index) => (
                <div key={unit.id} className="bg-neutral-900/70 p-4 rounded-lg border border-neutral-800 transition-all duration-300 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-blue-400">Unit {index + 1}</span>
                        {units.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemoveUnit(unit.id)}
                                className="text-neutral-500 hover:text-red-500 transition-colors duration-200"
                                aria-label="Remove Unit"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={`unit-name-${unit.id}`} className="block text-sm font-medium text-neutral-400 mb-1">Unit Name</label>
                            <input
                                type="text"
                                id={`unit-name-${unit.id}`}
                                name="name"
                                value={unit.name}
                                onChange={(e) => onUnitChange(unit.id, e)}
                                placeholder="e.g., Introduction"
                                required
                                className="w-full bg-neutral-800 border-neutral-700 rounded-md py-2 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor={`unit-topics-${unit.id}`} className="block text-sm font-medium text-neutral-400 mb-1">Topics (comma-separated)</label>
                            <input
                                type="text"
                                id={`unit-topics-${unit.id}`}
                                name="topics"
                                value={unit.topics}
                                onChange={(e) => onUnitChange(unit.id, e)}
                                placeholder="Wave-particle duality..."
                                required
                                className="w-full bg-neutral-800 border-neutral-700 rounded-md py-2 px-3 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>))
        }</>
    )
}

export default SyllabusInput