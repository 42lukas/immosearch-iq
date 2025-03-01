"use client";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { FaStar, FaRegStar, FaDownload } from "react-icons/fa";
import Link from 'next/link';

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
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

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

        const fetchFavorites = async () => {
            const userId = Cookies.get('userId');
            if (!userId) return;

            try {
                const response = await fetch(`/api/favorites?userId=${userId}`);
                const data = await response.json();
                if (data.success) {
                    const favoriteMap: { [key: string]: boolean } = {};
                    data.favorites.forEach((fav: Listing) => {
                        favoriteMap[fav.title] = true;
                    });
                    setFavorites(favoriteMap);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Favoriten", error);
            }
        };

        fetchUserData();
        fetchFavorites();
    }, []);

    const toggleFavorite = async (index: number, listing: Listing) => {
        const userId = Cookies.get('userId');
        if (!userId) return;

        const newFavorites = { ...favorites, [listing.title]: !favorites[listing.title] };
        setFavorites(newFavorites);

        try {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, listing })
            });
        } catch (error) {
            console.error("❌ Fehler beim Speichern des Favoriten:", error);
        }
    };

    const downloadApplication = async (listing: Listing) => {
        if (!userData) {
            alert("Benutzerdaten fehlen!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing, userData })
            });
            const data = await response.json();
            
            const blob = new Blob([data.application], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bewerbung_${listing.title}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Fehler beim Erstellen des Dokuments", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-800">
            <h1 className="flex justify-center text-2xl font-bold mb-6 text-white">🏡 Wohnungsangebote</h1>

            {/* Button, um zur MapPage zu navigieren */}
            <div className="flex justify-center mb-4">
                <Link href="/map">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Auf Karte anzeigen
                    </button>
                </Link>
            </div>

            <div className="grid gap-4 justify-center">
                {listings.map((listing, index) => (
                    <div key={index} className="relative border p-4 rounded-lg shadow-sm bg-white flex">
                        <button 
                            onClick={() => toggleFavorite(index, listing)}
                            className="absolute top-3 right-3 text-yellow-400 hover:scale-125 transition-transform duration-200"
                        >
                            {favorites[listing.title] ? (
                                <FaStar className="w-6 h-6 fill-current" />
                            ) : (
                                <FaRegStar className="w-6 h-6 fill-current" />
                            )}
                        </button>

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
                                    className={`px-1 py-1 text-white rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''} hover:scale-125 transition-transform duration-300 ease-in-out`}
                                    onClick={() => downloadApplication(listing)}
                                    disabled={loading}
                                >
                                    <FaDownload className='w-5 h-5 text-black'/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
