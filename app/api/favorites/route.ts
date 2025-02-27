import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(process.cwd(), "app/data/favorites.json");

const loadFavorites = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify({}), "utf-8");
        }
        const rawData = fs.readFileSync(dataFilePath, "utf-8");
        return rawData.trim() ? JSON.parse(rawData) : {}; 
    } catch (error) {
        console.error("❌ Fehler beim Laden der Favoriten:", error);
        return {}; 
    }
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "❌ Keine User-ID angegeben" }, { status: 400 });
        }

        const favorites = loadFavorites();
        return NextResponse.json({ success: true, favorites: favorites[userId] || [] });
    } catch (error) {
        console.error("❌ Fehler beim Abrufen der Favoriten:", error);
        return NextResponse.json({ error: "❌ Fehler beim Abrufen" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, listing } = await req.json();

        if (!userId || !listing) {
            return NextResponse.json({ error: "❌ Keine User-ID oder Listing angegeben" }, { status: 400 });
        }

        const favorites = loadFavorites();
        favorites[userId] = favorites[userId] || [];

        const index = favorites[userId].findIndex((fav: any) => fav.title === listing.title);

        if (index === -1) {
            favorites[userId].push(listing);
        } else {
            favorites[userId].splice(index, 1);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(favorites, null, 2), "utf-8");

        return NextResponse.json({ success: true, message: "✅ Favoriten aktualisiert" });
    } catch (error) {
        console.error("❌ Fehler beim Speichern der Favoriten:", error);
        return NextResponse.json({ error: "❌ Fehler beim Speichern" }, { status: 500 });
    }
}
