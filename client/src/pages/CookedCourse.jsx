import Header from '../components/CookedCourse/Header';
import MainBody from '../components/CookedCourse/MainBody';

function CookedCourse() {
    return (
        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <Header />

                <MainBody />

                <footer className="text-center mt-8 text-neutral-600 text-sm">
                    <p>&copy; cookedcourse</p>
                </footer>
            </div>
        </div>
    );
}

export default CookedCourse
