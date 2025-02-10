import Link from 'next/link';

export default function Homepage() {
    return (
        <div className="relative h-screen bg-gray-800">
            <div className="flex items-center justify-center h-full">
                <p className="font-bold">HOME</p>
            </div>

            <Link href="/">
                <button className="absolute bottom-5 left-5  px-4 py-2">
                    START
                </button>
            </Link>

            <Link href="/about">
                <button className="absolute bottom-5 right-5 px-4 py-2">
                    ABOUT
                </button>
            </Link>
        </div>
    );
}