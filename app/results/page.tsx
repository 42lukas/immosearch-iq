"use client";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";

interface Listing {
    title: string;
    price: number;
    address: string;
    city: string;
    rooms: number;
    size: number;
    url: string;
    imgUrl: string;
    score: number;
}

interface UserData {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    currentAddress: string;
    occupation: string;
    employer: string;
    monthlyIncome: string;
    hobbies: string[];
}

export default function ResultsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedResults = localStorage.getItem('results');
        if (savedResults) {
            setListings(JSON.parse(savedResults));
        }

        const fetchUserData = async () => {
            const userId = Cookies.get('userId');
            if (!userId) return;

            try {
                const response = await fetch(`/api/user?userId=${userId}`);
                const data = await response.json();
                if (data.success) {
                    setUserData(data.userData);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Benutzerinformationen", error);
            }
        };

        fetchUserData();
    }, []);

    const generateApplication = async (listing: Listing) => {
        if (!userData) {
            alert("⚠️ Keine Benutzerdaten verfügbar.");
            return;
        }

        setLoading(true);
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

            <div className="grid gap-4 justify-center">
                {listings.map((listing, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm bg-white flex">
                        <img src={listing.imgUrl} alt={listing.title} className='w-1/4 rounded-lg pe-4' />
                        <div className='flex flex-grow justify-between items-center'>
                            <div>
                                <h2 className="text-lg font-semibold mb-2 text-black">{listing.title}</h2>
                                <p className="text-gray-700">💶 Preis: {listing.price} €</p>
                                <p className="text-gray-700">📍 Adresse: {listing.address}</p>
                                <p className="text-gray-700">🛏️ Zimmer: {listing.rooms}</p>
                                <p className="text-gray-700">📐 Größe: {listing.size}m²</p>
                                <a href={listing.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-blue-600 hover:underline">
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
                    </div>
                ))}
            </div>
        </div>
    );
}
