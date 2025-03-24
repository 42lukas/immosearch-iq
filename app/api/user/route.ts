import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(process.cwd(), "app/data/userData.json");

/**
 * Hilfsfunktion zum Laden der Nutzerdaten aus der JSON-Datei.
 * Falls die Datei nicht existiert, wird sie initialisiert und ein leeres Objekt zurückgegeben.
 */
const loadUserData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}), "utf-8");
    }
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    // Wenn die Datei nicht leer ist, wird der Inhalt als JSON geparsed, andernfalls wird ein leeres Objekt zurückgegeben.
    return rawData.trim() ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("❌ Fehler beim Laden der Nutzerdaten:", error);
    return {};
  }
};

/**
 * GET zum Abrufen der Nutzerdaten für einen bestimmten Benutzer.
 * Erwartet wird ein Query-Parameter "userId"
 * Gibt die Nutzerdaten des angegebenen Benutzers zurück oder ein leeres Objekt, wenn keine Daten vorhanden sind.
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

    const users = loadUserData();

    const userData = users[userId] || {};

    return NextResponse.json({ success: true, userData });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der User-Daten:", error);
    return NextResponse.json(
      { error: "❌ Fehler beim Abrufen der Daten" },
      { status: 500 }
    );
  }
}

/**
 * POST zum Speichern der Nutzerdaten eines Benutzers.
 * Erwartet wird ein JSON-Body mit "userId" und "userData".
 * Die Daten werden in der JSON-Datei gespeichert.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, userData } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "❌ Keine User-ID angegeben" },
        { status: 400 }
      );
    }

    const users = loadUserData();
    users[userId] = userData;

    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "✅ Nutzerdaten gespeichert",
    });
  } catch (error) {
    console.error("❌ Fehler beim Speichern der User-Daten:", error);
    return NextResponse.json(
      { error: "❌ Fehler beim Speichern" },
      { status: 500 }
    );
  }
}
