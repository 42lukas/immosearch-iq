'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [preferences, setPreferences] = useState({
        city: "",
        minPrice: "",
        maxPrice: "",
        minRooms: "",
        maxRooms: "",
        minSize: "",
        maxSize: ""
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (["minPrice", "maxPrice", "minRooms", "maxRooms", "minSize", "maxSize"].includes(name)) {
            if (value === "" || /^\d*$/.test(value)) {
                setPreferences({ ...preferences, [name]: value });
            }
        } else {
            setPreferences({ ...preferences, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const formattedPreferences = {
            city: preferences.city,
            minPrice: preferences.minPrice === "" ? 0 : parseInt(preferences.minPrice, 10),
            maxPrice: preferences.maxPrice === "" ? 10000000 : parseInt(preferences.maxPrice, 10),
            minRooms: preferences.minRooms === "" ? 0 : parseFloat(preferences.minRooms),
            maxRooms: preferences.maxRooms === "" ? 10 : parseFloat(preferences.maxRooms),
            minSize: preferences.minSize === "" ? 0 : parseInt(preferences.minSize, 10),
            maxSize: preferences.maxSize === "" ? 500 : parseInt(preferences.maxSize, 10)
        };

        const response = await fetch('/api/crawler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedPreferences)
        });

        
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('results', JSON.stringify(data));
            router.push(`/results?city=${preferences.city}`);
            setLoading(false);
        } else {
            console.log('Fehler beim Starten des Crawlers!');
        }
    };

    return (
        <div className="bg-gray-800 text-white">
            {loading ? (
                <LoadingAnimation />
            ) : (
                <div className='p-6'>
                    <h1 className="text-xl font-bold mb-4">🏡 Wohnungssuche starten</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        {Object.entries(preferences).map(([key, value]) => (
                            <input
                                key={key}
                                name={key}
                                type={key === "city" ? "text" : "number"}
                                placeholder={key}
                                value={value}
                                onChange={handleChange}
                                className="p-2 border rounded text-black"
                            />
                        ))}
                        <button className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            🔍 Suche starten
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
