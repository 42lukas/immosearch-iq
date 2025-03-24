import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * POST zum Löschen einer Datei eines Nutzers.
 * Erwartet wird ein JSON-Body mit "userId" und "filename".
 */
export async function POST(req: NextRequest) {
  try {
    // Extrahiere userId und filename aus dem Request-Body
    const { userId, filename } = await req.json();

    if (!userId || !filename) {
      return NextResponse.json(
        { success: false, message: "userId oder filename fehlt!" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public", "uploads", userId, filename);

    // Prüfe, ob die Datei existiert
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Datei nicht gefunden." },
        { status: 404 }
      );
    }

    // Löschen der Datei
    await fs.promises.unlink(filePath);

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

// GET-Methode wird nicht unterstützt
export function GET() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405 }
  );
}
