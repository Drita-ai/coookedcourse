import { FaTrash } from "react-icons/fa";

function SyllabusInput({ units, onRemoveUnit, onUnitChange }) {
    return (
        <div className="space-y-12">
            {units.map((unit, index) => (
                <div key={unit.id} className="relative group pl-6 border-l-2 border-transparent hover:border-slate-400 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-600 transition-colors">
                            Unit 0{index + 1}
                        </span>
                        {units.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemoveUnit(unit.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                                aria-label="Remove Unit"
                            >
                                <FaTrash className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="name"
                                value={unit.name}
                                onChange={(e) => onUnitChange(unit.id, e)}
                                placeholder="Unit Name"
                                required
                                className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 outline-none"
                            />
                            <div className="h-[2px] w-full bg-slate-200  group-focus-within:bg-slate-500 transition-all duration-500" />
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="topics"
                                value={unit.topics}
                                onChange={(e) => onUnitChange(unit.id, e)}
                                placeholder="Key topics (comma separated)"
                                required
                                className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 outline-none"
                            />
                            <div className="h-[2px] w-full bg-slate-200 scale-x-100 group-focus-within:bg-slate-500 transition-all duration-500" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SyllabusInput;