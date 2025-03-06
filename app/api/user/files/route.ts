import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadBasePath = path.resolve(process.cwd(), "public/uploads");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // Hole userId aus Query-Params

    if (!userId) {
      return NextResponse.json({ error: "❌ Keine User-ID angegeben" }, { status: 400 });
    }

    const userDir = path.join(uploadBasePath, userId);

    if (!fs.existsSync(userDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(userDir);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Fehler beim Lesen des Upload-Verzeichnisses:", error);
    return NextResponse.json(
      { error: "Fehler beim Lesen des Upload-Verzeichnisses" },
      { status: 500 }
    );
  }
}