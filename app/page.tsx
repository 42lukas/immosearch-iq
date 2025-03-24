"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { getUserId } from "@/utils/auth";

/**
 * Diese Seite dient als Einstiegspunkt der Anwendung. Beim ersten Laden
 * wird mithilfe von getUserId() sichergestellt, dass eine eindeutige Benutzer-ID
 * im localStorage vorhanden ist
 */
export default function Home() {

  useEffect(() => {
    getUserId();
  }, []);

  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/redHouses.png')" }}
    >
      {/* Dunkler Overlay für bessere Lesbarkeit */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Zentrale Content-Box */}
      <div className="relative flex flex-col justify-center items-center h-full text-white text-center">
        <h1 className="pt-20 font-bold text-7xl">Immosearch-IQ</h1>
        <Link href="/home">
          <button className="relative mt-10 flex items-center justify-center bg-orange-600 py-5 px-10 rounded-md w-auto text-white font-extrabold hover:scale-110 transition-transform duration-300 ease-in-out group">
            Beginne deine Wohnungssuche
          </button>
        </Link>
      </div>
    </div>
  );
}
