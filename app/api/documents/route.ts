import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Hilfsfunktion zum Ersetzen der Platzhalter und Formatieren der Daten
const fillTemplate = (template: string, data: Record<string, string>) => {
    let filled = template;
    for (const key in data) {
        const placeholder = `{{${key}}}`;
        filled = filled.replace(new RegExp(placeholder, 'g'), data[key]);
    }
    return filled;
};

const calculateAge = (birthDate: string) => {
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
};

const formatHobbies = (hobbies: string[]) => {
    if (hobbies.length === 0) return "verschiedene Freizeitaktivitäten";
    
    const hobbyDescriptions: Record<string, string> = {
        "Lesen": "Ich lese gerne spannende Romane und Sachbücher, um mein Wissen zu erweitern.",
        "Sport": "Regelmäßige sportliche Aktivitäten helfen mir, fit und gesund zu bleiben.",
        "Kochen": "Ich probiere gerne neue Rezepte aus und genieße es, für Freunde und Familie zu kochen.",
        "Musik": "Musik ist ein wichtiger Teil meines Lebens, sei es durch das Hören oder das Spielen eines Instruments.",
        "Reisen": "Ich entdecke gerne neue Orte und Kulturen, um meinen Horizont zu erweitern."
    };

    return hobbies
        .map(hobby => hobbyDescriptions[hobby] || `Ich widme mich in meiner Freizeit dem Hobby ${hobby.toLowerCase()}.`)
        .join(" ");
};

const formatEmployment = (occupation: string, employer: string) => {
    const preposition = employer.match(/^(der|die|das|dem|den) /i) ? "beim" : "bei";
    return `${preposition} ${employer}`;
};

const generateRelocationReason = (reason: string) => {
    const reasons: Record<string, string> = {
        "beruflich": "Aufgrund einer neuen beruflichen Herausforderung suche ich eine Wohnung in dieser Gegend.",
        "familie": "Da sich meine familiäre Situation geändert hat, benötige ich eine neue Wohnsituation.",
        "veränderung": "Ich wünsche mir eine Veränderung und eine neue Umgebung zum Wohlfühlen."
    };
    return reasons[reason] || "Ich bin auf der Suche nach einer neuen Wohnung, die besser zu meinen aktuellen Lebensumständen passt.";
};

export async function POST(req: NextRequest) {
    const { listing, userData } = await req.json();

    // Berechnungen und Formatierungen
    const age = calculateAge(userData.birthDate);
    const hobbies = formatHobbies(userData.hobbies);
    const employment = formatEmployment(userData.occupation, userData.employer);
    const relocationReason = generateRelocationReason(userData.relocationReason);

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
        age: age.toString(),
        employer: employment,
        fullName: userData.fullName,
        currentAddress: userData.currentAddress,
        occupation: userData.occupation,
        monthlyIncome: userData.monthlyIncome,
        phone: userData.phone,
        email: userData.email,
        hobbies: hobbies,
        relocationReason: relocationReason
    });

    return NextResponse.json({ application });
}