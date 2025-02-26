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
        adress: listing.address,
        city: listing.city,
        price: listing.price.toString(),
        rooms: listing.rooms.toString(),
        size: listing.size.toString(),
        age: userData.birthDate,
        employer: userData.employer,
        fullName: userData.fullName,
        currentAddress: userData.currentAddress,
        occupation: userData.occupation,
        monthlyIncome: userData.monthlyIncome,
        phone: userData.phone,
        email: userData.email,
        hobbies: userData.hobbies ? userData.hobbies.join(", ") : ""
    });

    return NextResponse.json({ application });
}
