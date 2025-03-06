import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(process.cwd(), "app/data/userData.json");

const loadUserData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify({}), "utf-8");
    }

    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    return rawData.trim() ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("❌ Fehler beim Laden der Nutzerdaten:", error);
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

    const users = loadUserData();
    const userData = users[userId] || {};

    return NextResponse.json({ success: true, userData });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der User-Daten:", error);
    return NextResponse.json({ error: "❌ Fehler beim Abrufen der Daten" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, userData } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "❌ Keine User-ID angegeben" }, { status: 400 });
    }

    const users = loadUserData();
    users[userId] = userData;

    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "✅ Nutzerdaten gespeichert" });
  } catch (error) {
    console.error("❌ Fehler beim Speichern der User-Daten:", error);
    return NextResponse.json({ error: "❌ Fehler beim Speichern" }, { status: 500 });
  }
}