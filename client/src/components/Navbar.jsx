import { Github } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="bg-white/30 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <a href="/" className="flex items-center space-x-3 group">
                        <span className="font-bold text-xl text-gray-800 group-hover:text-black transition-colors duration-200">
                            CookedCourse
                        </span>
                    </a>
                    <a
                        href="https://github.com/Drita-ai"
                        target="_blank"
                        aria-label="GitHub Profile"
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <Github />
                    </a>

                </div>
            </nav>
        </header>
    );
};