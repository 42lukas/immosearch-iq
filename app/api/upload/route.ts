import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files");

        const savedFiles: string[] = [];

        for (const file of files) {
            if (file instanceof File) {
                const buffer = await file.arrayBuffer();
                const filePath = path.join(uploadDir, file.name);
                fs.writeFileSync(filePath, Buffer.from(buffer));
                savedFiles.push(`/uploads/${file.name}`);
            }
        }

        return NextResponse.json({ message: "✅ Dateien hochgeladen", files: savedFiles });
    } catch (error) {
        console.error("❌ Fehler beim Upload:", error);
        return NextResponse.json({ error: "Fehler beim Upload" }, { status: 500 });
    }
}