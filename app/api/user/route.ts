import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'app/data/userData.json');

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();

        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf-8');
        
        return NextResponse.json({ message: "✅ Nutzerdaten gespeichert" });
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Nutzerdaten:", error);
        return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Keine Nutzerdaten gefunden" }, { status: 404 });
        }
        
        const userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return NextResponse.json(userData);
    } catch (error) {
        console.error("❌ Fehler beim Laden der Nutzerdaten:", error);
        return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
    }
}