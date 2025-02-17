import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScoreManager } from '@/score/ScoreManager';
import { LocationScore } from '@/score/components/LocationScore';


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
const extractNumber = (text: string) => {
    return parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.'));
};

export async function POST(req: NextRequest) {
    const prefs = await req.json();
    const city = prefs.city.toLowerCase();
    const url = `https://www.immowelt.de/liste/${city}/wohnungen/mieten`;
    const listings: Listing[] = [];
    const scoreManager = new ScoreManager();

    try {
        // Website abrufen
        const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(response.data);

        // Durchsuche Inserate
        $('div[data-testid="serp-core-classified-card-testid"]').each((index, el) => {
            if (index >= 10) return false;

            const link = $(el).find('a[data-testid="card-mfe-covering-link-testid"]').attr('href')?.trim() || '';
            const fullLink = link.startsWith('http') ? link : `https://www.immowelt.de${link}`;

            const priceText = $(el).find('div[data-testid="cardmfe-price-testid"]').text().trim();
            const price = extractNumber(priceText);

            const keyFacts = $(el).find('div[data-testid="cardmfe-keyfacts-testid"]').text();
            const [roomsText, , sizeText] = keyFacts.split('·').map((t) => t.trim());
            const rooms = extractNumber(roomsText);
            const size = extractNumber(sizeText);

            const address = $(el).find('div[data-testid="cardmfe-description-box-address"]').text().trim();

            let city = "";
            const parts = address.split(',');
            if (parts.length >= 2) {
                const cityPart = parts[1].trim();
                const cityMatch = cityPart.match(/([A-Za-zäöüßÄÖÜ]+)/);
                if (cityMatch) {
                    city = cityMatch[0];
                }
            }

            const imgUrl = $(el).find('img.css-hc6pk4').attr('src') || '';
            
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

            let calculatedScore = scoreManager.calculateTotalScore(listing, prefs);
            if (isNaN(calculatedScore) || calculatedScore === undefined) {
                calculatedScore = 0;
            }

            listing.score = calculatedScore;
            

            console.log(`🏡 ${listing.title} → Score: ${listing.score}`);

            if (listing.score >= 5) {
                listings.push(listing);
            }
        });

        listings.sort((a, b) => b.score - a.score);
        return NextResponse.json(listings);
    } catch (error) {
        console.error('❌ Fehler beim Scraping:', error);
        return NextResponse.json({ error: 'Fehler beim Abrufen der Daten' }, { status: 500 });
    }
}
