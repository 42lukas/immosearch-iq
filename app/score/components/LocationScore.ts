import { ScoreComponent } from '@/types/ScoreComponent';
import { kiezListe } from '@/score/data/KiezList';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const cacheFilePath = path.resolve(process.cwd(), 'app/score/data/geocodeCache.json');

type CacheEntry = {
    address: string;
    city: string;
    lat: number;
    lon: number;
    fullAddress: string;
    timestamp: string;
};

export class LocationScore implements ScoreComponent {

    calculateScore(listing: any, preferences: any): number {
        let score = 0;
    
        this.getCoordinatesByAddress(listing.address, listing.city).then(coordinates => {
            if (!coordinates) return score;
    
            kiezListe.forEach(kiez => {
                if (listing.city === kiez.stadt.toLowerCase().trim()) {
                    const distance = this.coordinatesDistance(
                        coordinates.lat,
                        coordinates.lon,
                        kiez.koordinaten.lat,
                        kiez.koordinaten.lng
                    );
    
                    if (distance <= 1.5) {
                        score += 1;
                    }
                }
            });
        }).catch(error => {
            console.error("Fehler beim Abrufen der Koordinaten:", error);
        });
    
        return score;
    }
    

    async getCoordinatesByAddress(address: string, city: string) {
        let cache: CacheEntry[] = this.loadCache();

        const cachedEntry = cache.find((entry: CacheEntry) => entry.address === address && entry.city === city);
        if (cachedEntry) {
            console.log(`📍 Cache-Treffer für Adresse: ${address}`);
            return { lat: cachedEntry.lat, lon: cachedEntry.lon };
        }

        try {
            const encodedAddress = encodeURIComponent(address);
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'WohnungssuchApp/1.0' }
            });

            if (response.data.length > 0) {
                const { lat, lon, display_name } = response.data[0];
                const newEntry: CacheEntry = {
                    address,
                    city,
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    fullAddress: display_name,
                    timestamp: new Date().toISOString()
                };

                cache.push(newEntry);
                this.saveCache(cache);

                return { lat: newEntry.lat, lon: newEntry.lon };
            } else {
                console.warn('⚠️ Keine Koordinaten gefunden für:', address);
                return null;
            }
        } catch (error) {
            console.error('❌ Fehler beim Geocoding:', error);
            return null;
        }
    }

    coordinatesDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    loadCache(): CacheEntry[] {
        try {
            if (!fs.existsSync(cacheFilePath)) {
                fs.writeFileSync(cacheFilePath, '[]', 'utf-8');
            }
            const data = fs.readFileSync(cacheFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('⚠️ Fehler beim Laden des Caches:', error);
            return [];
        }
    }

    saveCache(cache: CacheEntry[]) {
        try {
            fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
            console.log('✅ Cache aktualisiert:', cacheFilePath);
        } catch (error) {
            console.error('⚠️ Fehler beim Speichern des Caches:', error);
        }
    }
}
