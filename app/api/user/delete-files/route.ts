import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { userId, filename } = await req.json();

    if (!userId || !filename) {
      return NextResponse.json(
        { success: false, message: "userId oder filename fehlt!" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "uploads", userId, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Datei nicht gefunden." },
        { status: 404 }
      );
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({
      success: true,
      message: "Datei erfolgreich gelöscht.",
    });
  } catch (error) {
    console.error("Fehler beim Löschen der Datei:", error);
    return NextResponse.json(
      { success: false, message: "Interner Serverfehler beim Löschen." },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed." }, { status: 405 });
}