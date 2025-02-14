import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const extractNumber = (text: string) => {
   return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.'));
};

function calculateScore(listing: any, prefs: any) {
    let score = 0;

    // Preisbewertung
    if (listing.price >= prefs.minPrice && listing.price <= prefs.maxPrice) score += 3;

    // Zimmerbewertung
    if (listing.rooms >= prefs.minRooms && listing.rooms <= prefs.maxRooms) score += 3;

    // Größenbewertung
    if (listing.size >= prefs.minSize && listing.size <= prefs.maxSize) score += 4;

    // ÖPNV-Simulation: Wenn die Adresse "Berlin" enthält, gib Bonuspunkte
    if (listing.address.includes('Berlin')) score += 2;

    return Math.min(score, 10);
}

// Hauptcrawler-Funktion
export async function POST(req: NextRequest) {
    const prefs = await req.json();
    const city = prefs.city.toLowerCase();

    const url = `https://www.immowelt.de/liste/${city}/wohnungen/mieten`;
    const listings: any[] = [];

    try {
        // Abruf der Website
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        // HTML mit Cheerio parsen
        const $ = cheerio.load(response.data);

        // Durchsuche jedes Inserat, max. 3 Ergebnisse
        $('div[data-testid="serp-core-classified-card-testid"]').each((index, el) => {
            if (index >= 3) return false; // Stop nach 3 Inseraten

            const link = $(el).find('a[data-testid="card-mfe-covering-link-testid"]').attr('href')?.trim() || '';
            const fullLink = link.startsWith('http') ? link : `https://www.immowelt.de${link}`;

            const priceText = $(el).find('div[data-testid="cardmfe-price-testid"]').text().trim();
            const price = extractNumber(priceText);

            const keyFacts = $(el).find('div[data-testid="cardmfe-keyfacts-testid"]').text();
            const [roomsText, , sizeText] = keyFacts.split('·').map((t) => t.trim());
            const rooms = extractNumber(roomsText);
            const size = extractNumber(sizeText);

            const address = $(el).find('div[data-testid="cardmfe-description-box-address"]').text().trim();
            const imgUrl = $(el).find('img.css-hc6pk4').attr('src') || '';

            const listing = {
                title: `Wohnung in ${address.split(',')[0]}`,
                price,
                rooms,
                size,
                address,
                imgUrl,
                url: fullLink,
                score: calculateScore({ price, rooms, size, address }, prefs)
            };

            if (listing.price && listing.size && listing.rooms) {
                listings.push(listing);
            }
        });

        // Sortiere nach Score absteigend
        listings.sort((a, b) => b.score - a.score);

        return NextResponse.json(listings);
    } catch (error) {
        console.error('Fehler beim Scraping:', error);
        return NextResponse.json({ error: 'Fehler beim Abrufen der Daten' }, { status: 500 });
    }
}