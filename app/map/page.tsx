"use client";
import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface MarkerData {
  lat: number;
  lon: number;
  address: string;
  fullAddress: string;
}

function FitBounds({ markers }: { markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);
  return null;
}

export default function MapPage() {
  const router = useRouter();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  const customMarkerIcon = useMemo(() => {
    const { renderToStaticMarkup } = require("react-dom/server");
    const markerMarkup = renderToStaticMarkup(<FaMapMarkerAlt size={30} color="red" />);
    return L.divIcon({
      html: markerMarkup,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    let listings: { address: string }[] = [];
    if (savedResults) {
      listings = JSON.parse(savedResults);
    }
    const listingAddresses = listings.map((l) => l.address);

    fetch("/data/geocodeCache.json")
      .then((res) => {
        if (!res.ok) throw new Error("Konnte geocodeCache.json nicht laden");
        return res.json();
      })
      .then((data: MarkerData[]) => {
        const filtered = data.filter((entry) => listingAddresses.includes(entry.address));
        setMarkers(filtered);
      })
      .catch((error) => console.error("Fehler beim Laden der Geocode-Daten:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Lade Karte...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-gray-900 flex justify-center">
      <motion.div 
        className="absolute top-4 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => router.back()}
          className="flex justify-center items-center bg-gray-800 rounded-lg p-3 hover:scale-110 transition-transform duration-300 ease-in-out"
        >
          <FaArrowLeft className="me-4 text-xl" />
          <h1 className="text-lg font-bold">zurück zur Liste</h1>
        </button>
      </motion.div>

      <div className="relative h-full w-full">
        <MapContainer center={[51.1657, 10.4515]} zoom={6} className="h-full w-full z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((m, i) => (
            <Marker key={i} position={[m.lat, m.lon]} icon={customMarkerIcon}>
              <Popup>
                <strong>{m.address}</strong>
                <br />
                {m.fullAddress}
              </Popup>
            </Marker>
          ))}
          <FitBounds markers={markers} />
        </MapContainer>
      </div>

      <motion.div
        className="fixed bottom-8 left-8 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={() => router.back()}>
          <FaArrowLeft size={24} />
        </button>
      </motion.div>
    </div>
  );
}