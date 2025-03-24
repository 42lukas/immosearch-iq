import { ScoreComponent } from '@/types/ScoreComponent';
import { kiezListe } from '@/score/data/KiezList';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const cacheFilePath = path.resolve(process.cwd(), 'public/data/geocodeCache.json');

// Typdefinition für Einträge im Geocode-Cache
type CacheEntry = {
  address: string;
  city: string;
  lat: number;
  lon: number;
  fullAddress: string;
  timestamp: string;
};

/**
 * Diese Klasse implementiert die ScoreComponent und berechnet einen Score für ein Inserat,
 * basierend darauf, wie nah sich das Inserat an definierten Kiezen (Stadtteilen) befindet.
 */
export class LocationScore implements ScoreComponent {

  /**
   * calculateScore: Berechnet den Score für ein Inserat.
   * Für jeden Kiez, der in der Stadt des Inserats vorkommt und dessen Distanz
   * zum Inserat <= 1.5 km beträgt, wird der Score um 1 erhöht.
   */
  async calculateScore(listing: any, preferences: any): Promise<number> {
    let score = 0;
    
    const coordinates = await this.getCoordinatesByAddress(listing.address, listing.city);
    
    if (!coordinates) {
      console.log(`Keine Koordinaten gefunden für ${listing.address}`);
      return score;
    }

    // Normalisiere den Stadtnamen des Inserats
    const listingCityNormalized = listing.city.toLowerCase().trim();

    for (const kiez of kiezListe) {
      // Normalisiere den Stadtnamen des Kiez-Eintrags
      const kiezCityNormalized = kiez.stadt.toLowerCase().trim();

      // Prüfe, ob der Inserats-Stadtname den Kiez-Stadtnamen enthält
      if (listingCityNormalized.includes(kiezCityNormalized)) {
        // Berechne die Distanz zwischen dem Inserat und den Koordinaten des Kiez
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

  /**
   * getCoordinatesByAddress: Ermittelt die geographischen Koordinaten für eine gegebene Adresse und Stadt
   * Zuerst wird im lokalen Cache nachgesehen, um unnötige API-Aufrufe zu vermeiden
   * Falls kein Cache-Eintrag gefunden wird => Anfrage an die Nominatim-API von OpenStreetMap
   */
  private async getCoordinatesByAddress(address: string, city: string) {
    let cache: CacheEntry[] = this.loadCache();

    const addressNormalized = address.toLowerCase().trim();
    const cityNormalized = city.toLowerCase().trim();

    // Suche nach einem passenden Eintrag im Cache
    const cachedEntry = cache.find(
      (entry: CacheEntry) => 
        entry.address.toLowerCase().trim() === addressNormalized &&
        entry.city.toLowerCase().trim() === cityNormalized
    );

    if (cachedEntry) {
      console.log(`📍 Cache-Treffer für Adresse: ${address}`);
      return { lat: cachedEntry.lat, lon: cachedEntry.lon };
    }

    // Falls kein Cache-Eintrag gefunden wurde, wird eine Anfrage an Nominatim gestellt
    try {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'WohnungssuchApp/1.0' }
      });

      if (response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        // Erstelle einen neuen Cache-Eintrag
        const newEntry: CacheEntry = {
          address,
          city,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          fullAddress: display_name,
          timestamp: new Date().toISOString()
        };

        // Füge den neuen Eintrag dem Cache hinzu und speichere ihn
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

  /**
   * coordinatesDistance: Berechnet die Distanz zwischen zwei geographischen Punkten 
   * Nutzung der dafür bekannten "Haversine-Formel"
   */
  private coordinatesDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Erdradius in Kilometern
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * loadCache: Lädt den Geocode-Cache aus der JSON-Datei.
   * Falls die Datei nicht existiert, wird sie initialisiert.
   */
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

  /**
   * saveCache: Speichert das Cache-Array in die JSON-Datei.
   * so sind spätere Anfragen schneller und belasten die OpenStreetAPI nicht
   */
  private saveCache(cache: CacheEntry[]) {
    try {
      fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
      console.log('✅ Cache aktualisiert:', cacheFilePath);
    } catch (error) {
      console.error('⚠️ Fehler beim Speichern des Caches:', error);
    }
  }
}
