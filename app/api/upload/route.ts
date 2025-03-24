import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadBasePath = path.resolve(process.cwd(), 'public/uploads');

// Falls es nicht existiert, wird es erstellt
if (!fs.existsSync(uploadBasePath)) {
    fs.mkdirSync(uploadBasePath, { recursive: true });
}

/**
 * POST zum Speichern von hochgeladenen Dateien eines Nutzers.
 * Erwartet wird ein Query-Parameter "userId" sowie ein FormData-Body mit dem Key "files".
 */
export async function POST(req: NextRequest) {
    try {
        // Hole den "userId"-Parameter aus der URL
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId"); 

        if (!userId) {
            return NextResponse.json({ error: "❌ Keine Nutzer-ID gefunden" }, { status: 400 });
        }

        // Erstelle ein Verzeichnis für den Nutzer, falls nicht vorhanden
        const userUploadPath = path.join(uploadBasePath, userId);
        if (!fs.existsSync(userUploadPath)) {
            fs.mkdirSync(userUploadPath, { recursive: true });
        }

        // Lese das FormData aus der Anfrage aus und hole alle hochgeladenen Dateien
        const formData = await req.formData();
        const files = formData.getAll("files");
        const savedFiles: string[] = [];

        // Verarbeite jede Datei einzeln
        for (const file of files) {
            if (file instanceof File) {
                const buffer = await file.arrayBuffer();
                const filePath = path.join(userUploadPath, file.name);
                fs.writeFileSync(filePath, Buffer.from(buffer));
                savedFiles.push(`/uploads/${userId}/${file.name}`);
            }
        }

        return NextResponse.json({ message: "✅ Dateien hochgeladen", files: savedFiles });
    } catch (error) {
        console.error("❌ Fehler beim Upload:", error);
        return NextResponse.json({ error: "Fehler beim Upload" }, { status: 500 });
    }
}
