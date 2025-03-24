"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getUserId } from "@/utils/auth";
import Navbar, { NavLink } from "@/components/Navbar";
import { FaMapMarkedAlt, FaHeart, FaInfoCircle, FaUserEdit } from "react-icons/fa";

/**
 * Interface für die Daten eines Inserats
 */
interface Listing {
  title: string;
  address: string;
  price: number;
  rooms: number;
  size: number;
  city: string;
}

/**
 * Interface für die Nutzerdaten, die für die Bewerbung verwendet werden
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
 * Diese Seite erlaubt es dem Nutzer, eine vorgefertigte Bewerbung basierend auf 
 * seinen hinterlegten Daten und den Angaben zum Inserat zu bearbeiten und als Textdatei herunterzuladen.
 */
export default function EditApplicationPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [listingData, setListingData] = useState<Listing | null>(null);
  // State für den Bewerbungstext, der bearbeitet und heruntergeladen werden kann
  const [applicationText, setApplicationText] = useState<string>("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // useEffect zum Laden der Nutzerdaten und Listing-Daten aus URL-Parametern
  useEffect(() => {
    // Funktion, um die Nutzerdaten anhand der userId abzurufen
    const fetchUserData = async () => {
      const userId = getUserId();

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

    // Erstelle ein Listing-Objekt anhand der Query-Parameter
    const queryListing: Listing = {
      title: searchParams.get("title") || "",
      address: searchParams.get("address") || "",
      city: searchParams.get("city") || "",
      price: Number(searchParams.get("price")) || 0,
      rooms: Number(searchParams.get("rooms")) || 0,
      size: Number(searchParams.get("size")) || 0
    };
    setListingData(queryListing);

    // Lade die Nutzerdaten vom Backend
    fetchUserData();
  }, [searchParams]);

  // useEffect zum Generieren eines Standard-Bewerbungstextes, wenn sowohl Nutzerdaten als auch Listing-Daten vorliegen
  useEffect(() => {
    if (userData && listingData) {
      const defaultText = `
Bewerbung für ${listingData.title} in ${listingData.city}

Sehr geehrte Damen und Herren,

ich, ${userData.fullName}, bewerbe mich hiermit auf die oben genannte Wohnung. 
Ich bin derzeit als ${userData.occupation} bei ${userData.employer} beschäftigt 
und beziehe ein monatliches Einkommen in Höhe von ${userData.monthlyIncome} Euro.

Mein derzeitiger Wohnsitz ist ${userData.currentAddress}. 
Ich interessiere mich besonders an Ihrer Wohnung, da sie sich in ${listingData.city} befindet 
und ${listingData.rooms} Zimmer sowie ${listingData.size}m² Wohnfläche bietet.

Über eine positive Rückmeldung von Ihnen würde ich mich sehr freuen.

Mit freundlichen Grüßen,

${userData.fullName}
Telefon: ${userData.phone}
E-Mail: ${userData.email}
      `;
      // Entfernt überflüssige Leerzeichen und Zeilenumbrüche am Anfang und Ende
      setApplicationText(defaultText.trim());
    }
  }, [userData, listingData]);

  /**
   * Handler zum Herunterladen des bearbeiteten Bewerbungstextes als .txt-Datei.
   * Es wird ein Blob erstellt, der dann über einen temporären Link zum Download angeboten wird.
   */
  const handleDownload = () => {
    if (!listingData) return;
    const blob = new Blob([applicationText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Der Dateiname wird anhand des Inseratstitels generiert
    a.download = `Bewerbung_${listingData.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      {/* Navbar mit definierten Navigationslinks */}
      <Navbar navLinks={navLinks} />

      {/* Motion-Container für einen Einblendeffekt */}
      <motion.div
        className="mx-auto w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Bewerbung bearbeiten
          </h1>
          {/* Button, der den Nutzer zur vorherigen Seite zurückführt */}
          <button
            onClick={() => router.back()}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Zurück zur Liste
          </button>
        </div>

        {/* Anzeige der Inseratsdaten */}
        {listingData && (
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Wohnung:
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Titel:</strong> {listingData.title}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Adresse:</strong> {listingData.address}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Stadt:</strong> {listingData.city}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Preis:</strong> {listingData.price} €
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Zimmer:</strong> {listingData.rooms}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Größe:</strong> {listingData.size}m²
            </p>
          </div>
        )}

        {/* Textarea zur Bearbeitung des Bewerbungstextes */}
        <div className="mb-6">
          <label
            htmlFor="applicationText"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-2"
          >
            Bewerbungstext bearbeiten:
          </label>
          <textarea
            id="applicationText"
            className="
              w-full
              border 
              rounded 
              bg-gray-50 
              dark:bg-gray-700 
              text-gray-800 
              dark:text-gray-100
              p-4
              resize-vertical
              min-h-[600px]
            "
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
          />
        </div>

        {/* Buttons zum Herunterladen der Bewerbung oder zum Abbrechen */}
        <div className="flex items-center justify-end gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            onClick={handleDownload}
          >
            Bewerbung herunterladen
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition"
            onClick={() => router.back()}
          >
            Abbrechen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
