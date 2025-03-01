"use client";
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

function FitBounds({ markers }: { markers: { lat: number; lon: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);
  return null;
}

export default function MapPage() {
  const [markers, setMarkers] = useState<
    { lat: number; lon: number; address: string; fullAddress: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Erstelle ein benutzerdefiniertes Marker-Icon aus dem React Icon
  const customMarkerIcon = useMemo(() => {
    const { renderToStaticMarkup } = require('react-dom/server');
    const markerMarkup = renderToStaticMarkup(<FaMapMarkerAlt size={30} color="red" />);
    return L.divIcon({
      html: markerMarkup,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  }, []);

  useEffect(() => {
    const savedResults = localStorage.getItem('results');
    let listings: { address: string }[] = [];
    if (savedResults) {
      listings = JSON.parse(savedResults);
    }
    const listingAddresses = listings.map((l) => l.address);

    fetch('/data/geocodeCache.json')
      .then((res) => {
        if (!res.ok) throw new Error('Konnte geocodeCache.json nicht laden');
        return res.json();
      })
      .then((data: any[]) => {
        const filtered = data.filter((entry) =>
          listingAddresses.includes(entry.address)
        );
        setMarkers(filtered);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Geocode-Daten:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Lade Karte...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Map-Bereich */}
      <div className="w-full" style={{ height: "80vh" }}>
        <MapContainer
          center={[51.1657, 10.4515]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
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
      {/* Button-Bereich */}
      <div className="flex justify-center p-4">
        <Link href="/results">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Zurück zu den Ergebnissen
          </button>
        </Link>
      </div>
    </div>
  );
}
