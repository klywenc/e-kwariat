// app/ksiazka/[id]/page.js
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
// import Link from 'next/link'; // Odkomentuj, jeśli będziesz używać

// Funkcja do pobierania danych książki
async function getBookDetails(bookId) {
    const id = parseInt(bookId, 10);
    if (isNaN(id)) {
        notFound();
    }

    try {
        const book = await prisma.ksiazka.findUnique({
            where: { id: id },
            include: {
                autorzy: true,
                gatunki: true,
                zdjecia: true,
                statusKsiazki: true,
            },
        });

        if (!book) {
            notFound();
        }
        return book;
    } catch (error) {
        console.error("Błąd podczas pobierania danych książki:", error);
        notFound();
    }
}

// Komponent strony
export default async function BookDetailsPage({ params }) {
    const book = await getBookDetails(params.id);

    const formattedPrice = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(Number(book.cena));

    const authorsDisplay = book.autorzy && book.autorzy.length > 0
        ? book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ')
        : 'Autor nieznany';

    const mainImage = book.zdjecia?.find(z => z.czyGlowne)?.url || book.zdjecia?.[0]?.url || "/images/cover.png";
    const mainImageAlt = book.zdjecia?.find(z => z.czyGlowne)?.opisAlt || book.zdjecia?.[0]?.opisAlt || `Okładka książki ${book.tytul}`;

    const thumbnails = book.zdjecia?.filter(z => z.url !== mainImage) || [];

    return (
        <main className="flex-grow flex items-center justify-center py-8 bg-gray-50">
            {/* ZMIANA: Dodano klasę mb-24 (margin-bottom: 6rem) aby stworzyć większy odstęp na dole */}
            <div className="container mx-auto px-4 py-8 bg-gray-100 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sekcja obrazków */}
                    <div>
                        <div
                            className="relative w-full h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={mainImage}
                                alt={mainImageAlt}
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        {thumbnails.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {thumbnails.map((thumb) => (
                                    <div key={thumb.id}
                                         className="relative h-24 w-full bg-gray-100 rounded overflow-hidden border hover:border-indigo-500 cursor-pointer">
                                        <Image
                                            src={thumb.url}
                                            alt={thumb.opisAlt || `Miniatura ${book.tytul}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="10vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sekcja informacji o książce */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                            {book.tytul} {book.rokWydania ? `(${book.rokWydania})` : ''}
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Autor: <span className="font-semibold">{authorsDisplay}</span>
                        </p>

                        {book.statusKsiazki && (
                            <p className={`text-sm font-semibold mb-1 px-3 py-1 inline-block rounded-full
                                ${book.statusKsiazki.nazwa === 'Dostępna' ? 'bg-green-100 text-green-700' :
                                book.statusKsiazki.nazwa === 'Zarezerwowana' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'}`}>
                                Status: {book.statusKsiazki.nazwa}
                            </p>
                        )}

                        <div className="my-4">
                            <span className="text-3xl font-bold text-indigo-600">{formattedPrice}</span>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Opis Stanu</h2>
                            <p className="text-gray-600 whitespace-pre-line">{book.opisStanu || 'Brak opisu stanu.'}</p>
                        </div>

                        {book.gatunki && book.gatunki.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Gatunki</h2>
                                <div className="flex flex-wrap gap-2">
                                    {book.gatunki.map(g => (
                                        <span key={g.id}
                                              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                            {g.nazwa}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                            Data dodania: {new Date(book.dataDodania).toLocaleDateString('pl-PL')}
                        </p>

                        <div className="mt-auto pt-6">
                            <button
                                disabled={book.statusKsiazki?.nazwa !== 'Dostępna'}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors
                                    ${book.statusKsiazki?.nazwa === 'Dostępna'
                                    ? 'bg-indigo-600 hover:bg-indigo-700'
                                    : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                {book.statusKsiazki?.nazwa === 'Dostępna' ? 'Dodaj do koszyka' : 'Niedostępna'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function generateMetadata({ params }) {
    const book = await getBookDetails(params.id);
    if (!book) {
        return {
            title: 'Nie znaleziono książki',
        };
    }

    const authorsString = Array.isArray(book.autorzy) && book.autorzy.length > 0
        ? book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ')
        : 'Nieznani autorzy';

    const descriptionLead = typeof book.opisStanu === 'string' ? book.opisStanu.substring(0, 150) : 'Brak opisu';

    return {
        title: `${book.tytul} - E-Kwariet`,
        description: `Szczegóły książki: ${book.tytul}, autorstwa ${authorsString}. ${descriptionLead}...`,
        openGraph: {
            title: `${book.tytul} - E-Kwariet`,
            description: `Szczegóły książki: ${book.tytul}.`,
            images: [
                {
                    url: book.zdjecia?.find(z => z.czyGlowne)?.url || book.zdjecia?.[0]?.url || '/images/cover.png',
                    width: 800,
                    height: 600,
                    alt: `Okładka ${book.tytul}`,
                },
            ],
        },
    };
}