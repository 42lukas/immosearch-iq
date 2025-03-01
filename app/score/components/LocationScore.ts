import { ScoreComponent } from '@/types/ScoreComponent';
import { kiezListe } from '@/score/data/KiezList';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const cacheFilePath = path.resolve(process.cwd(), 'public/data/geocodeCache.json');

type CacheEntry = {
  address: string;
  city: string;
  lat: number;
  lon: number;
  fullAddress: string;
  timestamp: string;
};

export class LocationScore implements ScoreComponent {

  async calculateScore(listing: any, preferences: any): Promise<number> {
    let score = 0;
    
    const coordinates = await this.getCoordinatesByAddress(listing.address, listing.city);
    
    if (!coordinates) {
      console.log(`Keine Koordinaten gefunden für ${listing.address}`);
      return score;
    }

    const listingCityNormalized = listing.city.toLowerCase().trim();

    for (const kiez of kiezListe) {
      const kiezCityNormalized = kiez.stadt.toLowerCase().trim();

      if (listingCityNormalized.includes(kiezCityNormalized)) {

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
    }

    console.log(score + " für " + listing.address);
    return score;
  }

  private async getCoordinatesByAddress(address: string, city: string) {
    let cache: CacheEntry[] = this.loadCache();

    const addressNormalized = address.toLowerCase().trim();
    const cityNormalized = city.toLowerCase().trim();

    const cachedEntry = cache.find(
      (entry: CacheEntry) => 
        entry.address.toLowerCase().trim() === addressNormalized &&
        entry.city.toLowerCase().trim() === cityNormalized
    );

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

  private coordinatesDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Erdradius
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private loadCache(): CacheEntry[] {
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

  private saveCache(cache: CacheEntry[]) {
    try {
      fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
      console.log('✅ Cache aktualisiert:', cacheFilePath);
    } catch (error) {
      console.error('⚠️ Fehler beim Speichern des Caches:', error);
    }
  }
}