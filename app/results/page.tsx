"use client";
import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaDownload, FaHome, FaInfoCircle, FaMapMarkedAlt, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import { getUserId } from "@/utils/auth";
import Link from "next/link";

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
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    const savedResults = localStorage.getItem("results");
    if (savedResults) {
      setListings(JSON.parse(savedResults));
    }

    const fetchUserData = async () => {
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

  const toggleFavorite = async (listing: Listing) => {
    const userId = getUserId();

    const newFavorites = { ...favorites, [listing.title]: !favorites[listing.title] };
    setFavorites(newFavorites);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing, userData })
      });
      const data = await response.json();
      
      const blob = new Blob([data.application], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/home" className="flex items-center gap-2 text-lg font-bold hover:scale-110 transition-transform">
          <FaHome /> Home
        </Link>

        <Link href="/map" className="flex items-center gap-2 font-bold hover:scale-110 transition-transform">
          <FaMapMarkedAlt /> Map Ansicht
        </Link>
        
        <Link href="/about" className="flex items-center gap-2 font-bold hover:scale-110 transition-transform">
          <FaInfoCircle /> About
        </Link>
      </motion.div>

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">🏡 Wohnungsangebote</h1>

        {listings.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Keine Angebote gefunden.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={index}
                className="relative border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col gap-3 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <img
                  src={
                    listing.imgUrl && listing.imgUrl.trim() !== ""
                      ? listing.imgUrl
                      : "/placeholder.png"
                  }
                  alt={listing.title}
                  className="rounded-lg w-full h-40 object-cover"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-black dark:text-white">{listing.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300">💶 {listing.price} €</p>
                  <p className="text-gray-700 dark:text-gray-300">📍 {listing.address}</p>
                  <p className="text-gray-700 dark:text-gray-300">🛏️ {listing.rooms} Zimmer</p>
                  <p className="text-gray-700 dark:text-gray-300">📐 {listing.size}m²</p>
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    🔗 Zum Inserat
                  </a>
                </div>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-black dark:text-white font-bold">{listing.score}</p>
                  <div className="flex items-center gap-2">
                    {/* Favoriten-Button */}
                    <button onClick={() => toggleFavorite(listing)}>
                      {favorites[listing.title] ? (
                        <FaStar className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <FaRegStar className="w-5 h-5 text-yellow-500" />
                      )}
                    </button>

                    {/* Download-Button */}
                    <button
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      onClick={() => downloadApplication(listing)}
                    >
                      <FaDownload className="w-5 h-5" />
                    </button>

                    {/* NEU: Edit-Button -> navigiert zur /edit-application Seite */}
                    <Link
                      href={{
                        pathname: "/edit-application",
                        query: {
                          title: listing.title,
                          address: listing.address,
                          price: listing.price,
                          rooms: listing.rooms,
                          size: listing.size,
                          city: listing.city,
                        },
                      }}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center"
                    >
                      <FaEdit className="w-5 h-5 mr-1" />
                      Bearbeiten
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
