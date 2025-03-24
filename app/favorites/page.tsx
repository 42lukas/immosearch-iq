"use client";

import { useEffect, useState } from 'react';
import { getUserId } from "@/utils/auth";
import { FaHeart, FaInfoCircle, FaMapMarkedAlt, FaTrash, FaUserEdit } from "react-icons/fa";
import Navbar, { NavLink } from '@/components/Navbar';

/**
 * Interface für die Struktur eines Inserats
 */
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

/**
 * Diese Seite zeigt alle vom Nutzer favorisierten Inserate an.
 * Die Favoriten werden vom Backend geladen und können über einen Button auch wieder entfernt werden.
 */
export default function FavoritesPage() {
    // State für die Favoritenliste und den Ladezustand
    const [favorites, setFavorites] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // useEffect zum Laden der Favoriten nach dem ersten Rendern
    useEffect(() => {
        // Hole die userId aus Local-Storage
        const userId = getUserId();

        // Asynchrone Funktion, um die Favoriten vom Backend abzurufen
        const fetchFavorites = async () => {
            try {
                // Anfrage an die API, welche die Favoriten zurückgibt
                const response = await fetch(`/api/favorites?userId=${userId}`);
                const data = await response.json();
                // Wenn der API-Aufruf erfolgreich war, setze die Favoriten in den State
                if (data.success) {
                    setFavorites(data.favorites);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Favoriten", error);
            } finally {
                // Ladeanzeige beenden, egal ob erfolgreich oder mit Fehler
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    /**
     * removeFavorite: Entfernt ein Inserat aus den Favoriten.
     * Es wird ein POST-Request an das Backend gesendet, das den Favoriten toggelt
     * Anschließend wird der lokale State aktualisiert.
     */
    const removeFavorite = async (listing: Listing) => {
        // Hole die User-ID erneut
        const userId = getUserId();

        try {
            // Sende einen POST-Request, um das Inserat aus den Favoriten zu entfernen
            await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, listing })
            });

            // Aktualisiere den lokalen State, indem das entfernte Inserat herausgefiltert wird
            setFavorites((prev) => prev.filter((fav) => fav.title !== listing.title));
        } catch (error) {
            console.error("Fehler beim Entfernen des Favoriten:", error);
        }
    };

    // Definiert die Navigationslinks für die Navbar
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
            {/* Navbar mit Navigationslinks */}
            <Navbar navLinks={navLinks} />
            <h1 className="text-3xl font-bold text-center mt-4 mb-6">⭐ Meine Favoriten</h1>

            {loading ? (
                // Anzeige, solange die Favoriten geladen werden
                <p className="text-center">⏳ Favoriten werden geladen...</p>
            ) : favorites.length === 0 ? (
                <p className="text-center text-gray-400">🚫 Keine Favoriten gespeichert.</p>
            ) : (
                // Grid-Layout zur Anzeige der Favoriten
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                    {favorites.map((listing, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
                            {/* Bild des Inserats */}
                            <img 
                                src={listing.imgUrl} 
                                alt={listing.title} 
                                className="w-full h-40 object-cover" 
                            />

                            {/* Details des Inserats */}
                            <div className="p-4 flex-grow">
                                <h2 className="text-xl font-semibold">{listing.title}</h2>
                                <p className="text-gray-400">💶 {listing.price} €</p>
                                <p className="text-gray-400">📍 {listing.address}</p>
                                <p className="text-gray-400">🛏️ {listing.rooms} Zimmer • 📐 {listing.size}m²</p>
                            </div>

                            {/* Unterer Bereich mit Link zum Inserat und Lösch-Button */}
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
