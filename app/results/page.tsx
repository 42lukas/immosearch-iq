"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Listing {
    title: string;
    price: string;
    address: string;
    link: string;
}

export default function ResultsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    const city = searchParams.get('city') || 'berlin'; // Default auf Berlin, falls nichts übergeben

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('/api/crawler', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city })
                });

                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error('Fehler beim Laden der Inserate:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [city]);

    if (loading) return <div className="p-4 text-center text-xl">🔍 Lade Inserate...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">🏡 Wohnungsangebote in {city}</h1>
            {listings.length === 0 && <p className="text-red-500">❌ Keine Inserate gefunden.</p>}

            <div className="grid gap-4">
                {listings.map((listing, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white">
                        <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
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
                ))}
            </div>
        </div>
    );
}