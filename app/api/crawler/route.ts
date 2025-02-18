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
    const city = prefs.city.toLowerCase();
    const url = `https://www.immowelt.de/liste/${city}/wohnungen/mieten`;
    const listings: Listing[] = [];
    const scoreManager = new ScoreManager();

    try {
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        $('div[data-testid="serp-core-classified-card-testid"]').each((index, el) => {
            // Link extrahieren
            const link = $(el).find('a[data-testid="card-mfe-covering-link-testid"]').attr('href')?.trim() || '';
            const fullLink = link.startsWith('http') ? link : `https://www.immowelt.de${link}`;

            // Preis extrahieren
            const priceText = $(el).find('div[data-testid="cardmfe-price-testid"]').text()?.trim() || '';
            const price = extractNumber(priceText);
            if (prefs.maxPrice && price > prefs.maxPrice) return;

            // KeyFacts extrahieren (Zimmer, Größe, Etage)
            const keyFacts = $(el).find('div[data-testid="cardmfe-keyfacts-testid"]').text() || '';
            const keyFactsArray = keyFacts.split('·').map((t) => t.trim());
            const rooms = extractNumber(keyFactsArray[0]); // Zimmer ist an erster Stelle
            const size = extractNumber(keyFactsArray[1]); // Größe ist an zweiter Stelle

            // Adresse und Stadt extrahieren
            const address = $(el).find('div[data-testid="cardmfe-description-box-address"]').text()?.trim() || 'Adresse unbekannt';
            const city = address.split(',')[1]?.trim() || prefs.city;

            // Bild extrahieren
            const imgUrl = $(el).find('img.css-hc6pk4').attr('src') || '';

            // Inserat-Objekt erstellen
            const listing: Listing = {
                title: `Wohnung in ${address.split(',')[0]}`,
                price,
                rooms,
                size,
                address,
                city,
                imgUrl,
                url: fullLink,
                publicTransportStops: Math.floor(Math.random() * 10),
                score: 0
            };

            console.log(`🏠 Inserat: ${listing.title} | Größe: ${listing.size} m² | Zimmer: ${listing.rooms}`);

            let calculatedScore = scoreManager.calculateTotalScore(listing, prefs);
            listing.score = isNaN(calculatedScore) ? 0 : calculatedScore;

            if (listing.score >= 5) {
                listings.push(listing);
            }
        });

        listings.sort((a, b) => b.score - a.score);
        console.log(`🔍 Insgesamt erfasste Inserate: ${listings.length}`);
        return NextResponse.json(listings);
    } catch (error) {
        console.error('❌ Fehler beim Scraping:', error);
        return NextResponse.json({ error: 'Fehler beim Abrufen der Daten' }, { status: 500 });
    }
}
