"use client";
import { useEffect, useState } from 'react';

interface Listing {
    title: string;
    price: string;
    address: string;
    imgURL: string;
    link: string;
    score: string;
}

export default function ResultsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(10);

    useEffect(() => {
        const savedResults = localStorage.getItem('results');
        if (savedResults) {
            setListings(JSON.parse(savedResults));
        }
    }, []);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <div className="p-6 bg-gray-800">
            <h1 className="flex justify-center text-2xl font-bold mb-6">🏡 Wohnungsangebote</h1>
            {listings.length === 0 && <p className="text-red-500">❌ Keine Inserate gefunden.</p>}

            <div className="grid gap-4">
                {listings.slice(0, visibleCount).map((listing, index) => (
                    <div
                        key={index}
                        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-lg font-semibold mb-2 text-black">{listing.title}</h2>
                            <p className="text-gray-700">💶 Preis: {listing.price} €</p>
                            <p className="text-gray-700">📍 Adresse: {listing.address}</p>
                            <a
                                href={listing.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-blue-600 hover:underline"
                            >
                                🔗 Zum Inserat
                            </a>
                        </div>
                        <div className="flex justify-center items-center min-w-[100px]">
                            <p className="text-black font-bold text-center">{listing.score}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Button zum Laden weiterer Inserate */}
            {visibleCount < listings.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                        Mehr laden
                    </button>
                </div>
            )}
        </div>
    );
}