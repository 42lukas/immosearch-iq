"use client";
import { useEffect, useState } from 'react';

// 🏡 Interface für Inserate
interface Listing {
    title: string;
    price: number;
    address: string;
    city: string;
    rooms: number;
    size: number;
    link: string;
    score: number;
}

export default function ResultsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);

    // Lade die Inserate beim Mounten
    useEffect(() => {
        const savedResults = localStorage.getItem('results');
        if (savedResults) {
            setListings(JSON.parse(savedResults));
        }
    }, []);

    // Funktion zum Generieren der Bewerbung
    const generateApplication = async (listing: Listing) => {
        setLoading(true);
        const userData = {
            name: "Max Mustermann",
            alter: 20,
            arbeitgeber: "Robert Koch-Institut",
            beruf: "Softwareentwickler",
            einkommen: "5000",
            einzugsdatum: "01.04.2025"
        };

        const response = await fetch('/api/documents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing, userData })
        });

        const data = await response.json();
        alert(`📄 Bewerbung:\n\n${data.application}`);
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-800">
            <h1 className="flex justify-center text-2xl font-bold mb-6 text-white">🏡 Wohnungsangebote</h1>

            <div className="grid gap-4">
                {listings.map((listing, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold mb-2 text-black">{listing.title}</h2>
                            <p className="text-gray-700">💶 Preis: {listing.price} €</p>
                            <p className="text-gray-700">📍 Adresse: {listing.address}</p>
                            <p className="text-gray-700">🛏️ Zimmer: {listing.rooms}</p>
                            <p className="text-gray-700">📐 Größe: {listing.size}m²</p>
                            <a href={listing.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-blue-600 hover:underline">
                                🔗 Zum Inserat
                            </a>
                        </div>

                        <div className="flex items-center min-w-[150px] justify-center gap-4">
                            <p className="text-black font-bold text-center text-xl">{listing.score}</p>
                            <button 
                                className={`px-1 py-1 bg-gray-200 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-110 transition-transform duration-300 ease-in-out`}
                                onClick={() => generateApplication(listing)}
                                disabled={loading}
                            >
                                <img className='w-5 h-5' src='download_icon.png' alt='Download Bewerbung'/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
