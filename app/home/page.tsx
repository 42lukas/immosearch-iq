"use client"; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [preferences, setPreferences] = useState({
        city: "",
        minPrice: 0,
        maxPrice: 10000000,
        minRooms: 0,
        maxRooms: 10,
        minSize: 0,
        maxSize: 500
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPreferences({ ...preferences, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/crawler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences)
        });

        if (response.ok) {
            // API-Call erfolgreich → weiterleiten zu /results
            router.push(`/results?city=${preferences.city.toLowerCase()}`);
        } else {
            alert('Fehler beim Starten des Crawlers!');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">🏡 Wohnungssuche starten</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {Object.keys(preferences).map((key) => (
                    <input
                        key={key}
                        name={key}
                        type="text"
                        placeholder={key}
                        value={preferences[key as keyof typeof preferences]}
                        onChange={handleChange}
                        className="p-2 border rounded"
                    />
                ))}
                <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">🔍 Suche starten</button>
            </form>
        </div>
    );
}