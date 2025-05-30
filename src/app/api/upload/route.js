// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Do generowania unikalnych nazw plików

export async function POST(request) {
    try {
        const data = await request.formData();
        const files = data.getAll('files'); // 'files' to nazwa pola z inputu type="file"

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, error: 'Nie przesłano plików.' }, { status: 400 });
        }

        const uploadedFileUrls = [];

        for (const file of files) {
            if (!(file instanceof File)) {
                console.warn("Element w 'files' nie jest plikiem:", file);
                continue; // Pomiń, jeśli to nie jest obiekt File
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generuj unikalną nazwę pliku, aby uniknąć nadpisywania
            const fileExtension = path.extname(file.name);
            const uniqueFileName = `${uuidv4()}${fileExtension}`;

            // WAŻNE: Zapisywanie plików w folderze `public` sprawi, że będą one publicznie dostępne
            // np. pod adresem /uploads/nazwa_pliku.jpg
            // Upewnij się, że folder `public/uploads` istnieje!
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filePath = path.join(uploadDir, uniqueFileName);

            // Możesz chcieć stworzyć folder `uploads` jeśli nie istnieje, ale `fs/promises` nie ma `mkdir` z `recursive: true` w starszych Node.
            // Dla prostoty zakładamy, że folder istnieje. W produkcji lepiej użyć biblioteki lub sprawdzić/stworzyć.
            // import fs from 'fs';
            // if (!fs.existsSync(uploadDir)) {
            //   fs.mkdirSync(uploadDir, { recursive: true });
            // }

            await writeFile(filePath, buffer);
            console.log(`Plik zapisany w: ${filePath}`);

            // URL, pod którym plik będzie dostępny
            const publicUrl = `/uploads/${uniqueFileName}`;
            uploadedFileUrls.push({ url: publicUrl, name: file.name }); // Zwracamy też oryginalną nazwę, może się przydać
        }

        return NextResponse.json({ success: true, urls: uploadedFileUrls });

    } catch (error) {
        console.error('Błąd podczas uploadu plików:', error);
        return NextResponse.json({ success: false, error: error.message || 'Błąd serwera podczas uploadu.' }, { status: 500 });
    }
}