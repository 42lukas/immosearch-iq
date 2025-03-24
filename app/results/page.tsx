"use client";

import { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaDownload,
  FaHome,
  FaInfoCircle,
  FaMapMarkedAlt,
  FaEdit,
  FaUserEdit,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { getUserId } from "@/utils/auth";
import Navbar, { NavLink } from "@/components/Navbar";
import Link from "next/link";

/**
 * Interface für ein Inserat
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
 * Interface für die Nutzerdaten, die für Bewerbung und Favoriten genutzt werden.
 */
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

/**
 * Hilfsfunktion, um den ersten Buchstaben eines Stadtnamens groß zu schreiben.
 */
const FirstLetterUpperCase = (city: string | null): string => {
  if (!city) return "";
  return city.charAt(0).toUpperCase() + city.slice(1);
};

/**
 * Diese Seite zeigt die gecrawlten Inserate an. 
 * Es werden auch die Favoriten des Nutzers geladen und die Möglichkeit geboten, 
 * eine Bewerbung als Textdatei herunterzuladen oder die Bewerbung zu bearbeiten.
 */
export default function ResultsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [city, setValue] = useState<string | null>(null);
  const [formattedCity, setFormattedCity] = useState<string>("");

  // Beim ersten Rendern: Inserate, Stadtparameter, Nutzerdaten und Favoriten laden
  useEffect(() => {
    const userId = getUserId();
    
    // Inserate werden im localStorage unter "results" gespeichert
    const savedResults = localStorage.getItem("results");
    if (savedResults) {
      setListings(JSON.parse(savedResults));
    }

    // Aus den URL-Parametern die Stadt auslesen und formatieren
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    setValue(cityParam);
    if (cityParam) {
      const formatted = FirstLetterUpperCase(cityParam);
      setFormattedCity(formatted);
    }

    // Funktion zum Abrufen der Nutzerdaten vom Backend
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

    // Funktion zum Abrufen der Favoriten des Nutzers
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          // Erstelle ein Mapping, bei dem der Titel eines Inserats als Schlüssel dient
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

  /**
   * toggleFavorite: Schaltet den Favoriten-Status eines Inserats um.
   * Es wird ein POST-Request an den favorites-Enpunkt der API geschickt und der lokale State aktualisiert.
   */
  const toggleFavorite = async (listing: Listing) => {
    const userId = getUserId();

    const newFavorites = {
      ...favorites,
      [listing.title]: !favorites[listing.title],
    };
    setFavorites(newFavorites);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, listing }),
      });
    } catch (error) {
      console.error("❌ Fehler beim Speichern des Favoriten:", error);
    }
  };

  /**
   * downloadApplication: Erstellt eine Bewerbung basierend auf den Inserats- und Nutzerdaten
   * und startet den Download als .txt-Datei.
   */
  const downloadApplication = async (listing: Listing) => {
    if (!userData) {
      alert("Benutzerdaten fehlen!");
      return;
    }
    setLoading(true);
    try {
      // Sende Nutzerdaten und Inserat an die API, das die Bewerbung generiert
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing, userData }),
      });
      const data = await response.json();

      const blob = new Blob([data.application], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Dateiname wird anhand des Inseratstitels generiert
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

  // Definiert die Navigationslinks für die Navbar
  const navLinks: NavLink[] = [
    {
      href: "/map",
      label: "Map",
      icon: FaMapMarkedAlt,
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: FaHeart,
    },
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
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Anzeige der Navigationsleiste */}
      <Navbar navLinks={navLinks} />

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          🏡 Wohnungsangebote für {formattedCity}
        </h1>

        {/* Falls keine Inserate vorhanden sind */}
        {listings.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Keine Angebote gefunden.
          </p>
        ) : (
          // Grid-Layout zur Darstellung der Inserate
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <motion.div
                key={index}
                className="relative border p-4 rounded-lg shadow-lg bg-gray-800 flex flex-col gap-3 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Inseratsbild, Platzhalter falls kein Bild vorhanden */}
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
                  <h2 className="text-lg font-semibold text-black dark:text-white">
                    {listing.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    💶 {listing.price} €
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    📍 {listing.address}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    🛏️ {listing.rooms} Zimmer
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    📐 {listing.size}m²
                  </p>
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    🔗 Zum Inserat
                  </a>
                </div>
                {/* Bereich für Favoriten, Download und Bearbeitung */}
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-black dark:text-white font-bold">
                    {listing.score}
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Favoriten-Toggle */}
                    <button onClick={() => toggleFavorite(listing)}>
                      {favorites[listing.title] ? (
                        <FaStar className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <FaRegStar className="w-5 h-5 text-yellow-500" />
                      )}
                    </button>
                    {/* Download-Button für die Bewerbung */}
                    <button
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      onClick={() => downloadApplication(listing)}
                    >
                      <FaDownload className="w-5 h-5" />
                    </button>
                    {/* Link zur Seite "Bewerbung bearbeiten" */}
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
