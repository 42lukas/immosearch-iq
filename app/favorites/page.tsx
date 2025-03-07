"use client";
import { useEffect, useState } from 'react';
import { getUserId } from "@/utils/auth";
import { FaHeart, FaInfoCircle, FaMapMarkedAlt, FaTrash, FaUserEdit } from "react-icons/fa";
import Navbar, { NavLink } from '@/components/Navbar';

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

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = getUserId();
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/api/favorites?userId=${userId}`);
                const data = await response.json();
                if (data.success) {
                    setFavorites(data.favorites);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Favoriten", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const removeFavorite = async (listing: Listing) => {
        const userId = getUserId();

        try {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, listing })
            });

            setFavorites((prev) => prev.filter((fav) => fav.title !== listing.title));
        } catch (error) {
            console.error("Fehler beim Entfernen des Favoriten:", error);
        }
    };

    const navLinks: NavLink[] = [
        {
        href: "/about",
        label: "About",
        icon: FaInfoCircle,
        },
        {
        href: "/user",
        label: "User",
        icon: FaUserEdit,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar navLinks={navLinks} />
            <h1 className="text-3xl font-bold text-center mt-4 mb-6">⭐ Meine Favoriten</h1>

            {loading ? (
                <p className="text-center">⏳ Favoriten werden geladen...</p>
            ) : favorites.length === 0 ? (
                <p className="text-center text-gray-400">🚫 Keine Favoriten gespeichert.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                    {favorites.map((listing, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
                            <img 
                                src={listing.imgUrl} 
                                alt={listing.title} 
                                className="w-full h-40 object-cover" 
                            />

                            <div className="p-4 flex-grow">
                                <h2 className="text-xl font-semibold">{listing.title}</h2>
                                <p className="text-gray-400">💶 {listing.price} €</p>
                                <p className="text-gray-400">📍 {listing.address}</p>
                                <p className="text-gray-400">🛏️ {listing.rooms} Zimmer • 📐 {listing.size}m²</p>
                            </div>

                            {/* Unterer Bereich unten fixieren */}
                            <div className="p-4 mt-auto flex justify-between items-center">
                                <a
                                    href={listing.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                >
                                    🔗 Zum Inserat
                                </a>
                                <button 
                                    onClick={() => removeFavorite(listing)}
                                    className="text-red-400 hover:text-red-600 transition"
                                >
                                    <FaTrash className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
