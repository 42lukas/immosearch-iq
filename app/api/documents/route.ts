import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Hilfsfunktion zum Ersetzen der Platzhalter
const fillTemplate = (template: string, data: Record<string, string>) => {
    let filled = template;
    for (const key in data) {
        const placeholder = `{{${key}}}`;
        filled = filled.replace(new RegExp(placeholder, 'g'), data[key]);
    }
    return filled;
};

export async function POST(req: NextRequest) {
    const { listing, userData } = await req.json();

    // Lade Bewerbungsvorlage
    const templatePath = path.resolve(process.cwd(), 'app/templates/applicationTemplate.txt');
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Erstelle das Bewerbungsschreiben
    const application = fillTemplate(template, {
        kontaktperson: 'Vermieter/in',
        adresse: listing.address,
        stadt: listing.city,
        preis: listing.price.toString(),
        zimmer: listing.rooms.toString(),
        groesse: listing.size.toString(),
        alter: userData.alter,
        arbeitgeber: userData.arbeitgeber,
        name: userData.name,
        beruf: userData.beruf,
        einkommen: userData.einkommen,
        einzugsdatum: userData.einzugsdatum,
    });

    return NextResponse.json({ application });
}
