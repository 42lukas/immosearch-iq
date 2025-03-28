import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(process.cwd(), "app/data/favorites.json");

/**
 * Lädt die Favoriten aus der JSON-Datei.
 * Falls die Datei oder das Verzeichnis nicht existiert, wird beides initialisiert.
 */
const loadFavorites = () => {
  try {
    // Verzeichnis anlegen, falls nicht vorhanden
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // JSON-Datei anlegen, falls nicht vorhanden
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}), "utf-8");
    }

    // Datei lesen und Inhalt parsen (falls nicht leer)
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    return rawData.trim() ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("❌ Fehler beim Laden der Favoriten:", error);
    return {};
  }
};

/**
 * GET: Gibt die Favoriten eines Benutzers zurück.
 * Erwartet wird ein Query-Parameter "userId".
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "❌ Keine User-ID angegeben" },
        { status: 400 }
      );
    }

    const favorites = loadFavorites();
    return NextResponse.json({ success: true, favorites: favorites[userId] || [] });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Favoriten:", error);
    return NextResponse.json(
      { error: "❌ Fehler beim Abrufen" },
      { status: 500 }
    );
  }
}

/**
 * POST: Fügt ein Inserat zu den Favoriten eines Benutzers hinzu oder entfernt es.
 * Erwartet wird ein JSON-Body mit "userId" und "listing".
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, listing } = await req.json();

    if (!userId || !listing) {
      return NextResponse.json(
        { error: "❌ Keine User-ID oder Listing angegeben" },
        { status: 400 }
      );
    }

    const favorites = loadFavorites();
    favorites[userId] = favorites[userId] || [];

    // Prüfe, ob das Inserat bereits in den Favoriten ist
    const index = favorites[userId].findIndex((fav: any) => fav.title === listing.title);

    // Wenn das Inserat nicht existiert, füge es hinzu; existiert es bereits, entferne es
    if (index === -1) {
      favorites[userId].push(listing);
    } else {
      favorites[userId].splice(index, 1);
    }

    // Speichere die aktualisierten Favoriten in der Datei
    fs.writeFileSync(dataFilePath, JSON.stringify(favorites, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "✅ Favoriten aktualisiert" });
  } catch (error) {
    console.error("❌ Fehler beim Speichern der Favoriten:", error);
    return NextResponse.json(
      { error: "❌ Fehler beim Speichern" },
      { status: 500 }
    );
  }
}
