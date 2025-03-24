import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScoreManager } from '@/score/ScoreManager';

// Schnittstelle für ein Immobilien-Inserat
export interface Listing {
    title: string;
    price: number;
    rooms: number;
    size: number;
    city: string;
    address: string;
    imgUrl: string;
    url: string;
    publicTransportStops: number;
    score: number;
}

// Hilfsfunktion zum Parsen von Zahlen aus Text
const extractNumber = (text: string | undefined): number => {
    if (!text) return 0;
    // Entfernt alle Zeichen außer Ziffern und Komma, ersetzt Komma durch Punkt
    return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

// Funktion zur Umwandlung des Stadtnamens in ein URL-kompatibles Format
const convertCityToUrlFormat = (city: string): string => {
  return city
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/\s+/g, '-');
};

// API-Handler für POST-Anfragen, der den Crawler ausführt
export async function POST(req: NextRequest) {
    // Erwartete Preferences: { city: string, maxPrice?: number, ... }
    const prefs = await req.json();
    const convertedCity = convertCityToUrlFormat(prefs.city);
    // URL für die Immowelt-Suche basierend auf der Stadt
    const url = `https://www.immowelt.de/liste/${convertedCity}/wohnungen/mieten`;

    const scoreManager = new ScoreManager();

    try {
        // HTTP-Request an Immowelt senden
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        // Alle Inserat ermitteln
        const cardElements = $('div[data-testid="serp-core-classified-card-testid"]').toArray();

        const listings: Listing[] = [];

        for (const cardElement of cardElements) {
            // Link zum Inserat ermitteln und vollständige URL generieren
            const link = $(cardElement).find('a[data-testid="card-mfe-covering-link-testid"]').attr('href')?.trim() || '';
            const fullLink = link.startsWith('http') ? link : `https://www.immowelt.de${link}`;
            
            // Preis ermitteln und als Zahl parsen
            const priceText = $(cardElement).find('div[data-testid="cardmfe-price-testid"]').text()?.trim() || '';
            const price = extractNumber(priceText);
            // Überspringe Inserate, die über dem maximalen Preis liegen
            if (prefs.maxPrice && price > prefs.maxPrice) continue;
          
            // Schlüssel-Fakten (z. B. Zimmer, Größe) extrahieren
            const keyFacts = $(cardElement).find('div[data-testid="cardmfe-keyfacts-testid"]').text() || '';
            const keyFactsArray = keyFacts.split('·').map((t) => t.trim());
            const rooms = extractNumber(keyFactsArray[0]); 
            const size = extractNumber(keyFactsArray[1]);  
          
            // Adresse auslesen
            const address = $(cardElement)
              .find('div[data-testid="cardmfe-description-box-address"]')
              .text()
              ?.trim() || 'Adresse unbekannt';
          
            // Adresse in einzelne Teile splitten und Stadt ermitteln
            const addressParts = address.split(',');
            let potentialCity = addressParts[addressParts.length - 1]?.trim() || ''; 
            potentialCity = potentialCity.replace(/\(.*?\)/, '').trim();
            const city = potentialCity || prefs.city;
          
            // Bild-URL ermitteln
            const imgUrl = $(cardElement).find('img.css-hc6pk4').attr('src') || '';
          
            // Erstelle das Listing-Objekt
            const listing: Listing = {
              title: `Wohnung in ${addressParts[0]}`,
              price,
              rooms,
              size,
              address,
              city,
              imgUrl,
              url: fullLink,
              publicTransportStops: 0,
              score: 0
            };
          
            console.log(`🏠 Inserat: ${listing.title} | Größe: ${listing.size} m² | Zimmer: ${listing.rooms} | Stadt: ${city}`);
          
            // Berechne den Score des Inserats basierend auf den Preferences
            const calculatedScore = await scoreManager.calculateTotalScore(listing, prefs);
            listing.score = isNaN(calculatedScore) ? 0 : calculatedScore;
          
            // Füge das Inserat zur Liste hinzu, wenn der Score einen Mindestwert erreicht
            if (listing.score >= 5) {
              listings.push(listing);
            }
        }

        // Sortiere die Inserate absteigend nach Score
        listings.sort((a, b) => b.score - a.score);

        console.log(`🔍 Insgesamt erfasste Inserate: ${listings.length}`);
        return NextResponse.json(listings);
    } catch (error) {
        console.error('❌ Fehler beim Scraping:', error);
        return NextResponse.json({ error: 'Fehler beim Abrufen der Daten' }, { status: 500 });
    }
}
