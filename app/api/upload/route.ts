import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadBasePath = path.resolve(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadBasePath)) {
    fs.mkdirSync(uploadBasePath, { recursive: true });
}

export async function POST(req: NextRequest) {
    const userId = req.cookies.get('userID')?.value;
    if (!userId) {
        return NextResponse.json({ error: "Keine Nutzer-ID gefunden" }, { status: 400 });
    }

    const userUploadPath = path.join(uploadBasePath, userId);
    if (!fs.existsSync(userUploadPath)) {
        fs.mkdirSync(userUploadPath, { recursive: true });
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll("files");
        const savedFiles: string[] = [];

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