import { PiCookingPotDuotone } from 'react-icons/pi'

function Header() {
    return (
        <div className="mb-10 text-left flex justify-center items-center flex-col">
            <h1 className="flex justify-center items-center text-4xl pt-10 font-light tracking-tight text-slate-900">
                <div className="relative w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gray-900 shadow-sm">
                    <PiCookingPotDuotone className='w-4.5 h-4.5 text-white' />
                </div>
                &nbsp;Cooked<span className="font-semibold">Course</span>
            </h1>
            <p className="text-slate-500 text-sm font-light leading-relaxed max-w-xs py-2">
                Enter your syllabus details to generate a structured study journey.
            </p>
        </div>
    )
}

export default Header

