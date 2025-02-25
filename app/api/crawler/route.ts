import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScoreManager } from '@/score/ScoreManager';

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

// Hilfsfunktion zum Parsen von Zahlen
const extractNumber = (text: string | undefined) => {
    if (!text) return 0;
    return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

export async function POST(req: NextRequest) {
    const prefs = await req.json();
    const cityLower = prefs.city.toLowerCase();
    const url = `https://www.immowelt.de/liste/${cityLower}/wohnungen/mieten`;

    // ScoreManager ist asynchron
    const scoreManager = new ScoreManager();

    try {
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        // Array aller Cards sammeln
        const cardElements = $('div[data-testid="serp-core-classified-card-testid"]').toArray();

        // Hier sammeln wir alle gefilterten Listings
        const listings: Listing[] = [];

        for (const el of cardElements) {
            // Link extrahieren
            const link = $(el).find('a[data-testid="card-mfe-covering-link-testid"]').attr('href')?.trim() || '';
            const fullLink = link.startsWith('http') ? link : `https://www.immowelt.de${link}`;
          
            // Preis extrahieren
            const priceText = $(el).find('div[data-testid="cardmfe-price-testid"]').text()?.trim() || '';
            const price = extractNumber(priceText);
            if (prefs.maxPrice && price > prefs.maxPrice) continue;
          
            // KeyFacts extrahieren (Zimmer, Größe)
            const keyFacts = $(el).find('div[data-testid="cardmfe-keyfacts-testid"]').text() || '';
            const keyFactsArray = keyFacts.split('·').map((t) => t.trim());
            const rooms = extractNumber(keyFactsArray[0]); 
            const size = extractNumber(keyFactsArray[1]);  
          
            // -----------------------------
            // Adresse: Den ganzen String
            // -----------------------------
            const address = $(el)
              .find('div[data-testid="cardmfe-description-box-address"]')
              .text()
              ?.trim() || 'Adresse unbekannt';
          
            // Stadt parsen: typisches Muster = "Straße, Ortsteil, Stadt (PLZ)"
            const splitted = address.split(',');
            let potentialCity = splitted[splitted.length - 1]?.trim() || ''; 
            // z.B. "Erlangen (91054)" oder "Berlin (10553)"
          
            // In Klammern stehende PLZ entfernen
            potentialCity = potentialCity.replace(/\(.*?\)/, '').trim();
            // z.B. => "Erlangen" oder "Berlin"
          
            // fallback auf prefs.city
            const city = potentialCity || prefs.city;
          
            // Bild
            const imgUrl = $(el).find('img.css-hc6pk4').attr('src') || '';
          
            // Inserat
            const listing: Listing = {
              title: `Wohnung in ${address.split(',')[0]}`,
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
          
            // calculateScore
            const calculatedScore = await scoreManager.calculateTotalScore(listing, prefs);
            listing.score = isNaN(calculatedScore) ? 0 : calculatedScore;
          
            if (listing.score >= 5) {
              listings.push(listing);
            }
        }

        // Nach Score sortieren
        listings.sort((a, b) => b.score - a.score);

        console.log(`🔍 Insgesamt erfasste Inserate: ${listings.length}`);
        return NextResponse.json(listings);
    } catch (error) {
        console.error('❌ Fehler beim Scraping:', error);
        return NextResponse.json({ error: 'Fehler beim Abrufen der Daten' }, { status: 500 });
    }
}