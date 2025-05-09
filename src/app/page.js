// app/page.js
import prisma from '@/lib/prisma'; // <--- ZMIANA: Importuj współdzieloną instancję
import BookGrid from '@/app/components/BookGrid'; // Upewnij się, że ścieżka jest poprawna, jeśli BookGrid jest w src/app/components, to może być '@/components/BookGrid'

// const prisma = new PrismaClient(); // <--- USUŃ TĘ LINIĘ

// Funkcja pomocnicza do serializacji książek
const serializeBooks = (booksToSerialize) => {
  return booksToSerialize.map(book => ({
    ...book,
    cena: book.cena.toNumber(), // Konwersja Decimal na number
    dataDodania: book.dataDodania.toISOString(), // Konwersja Date na ISO string
    dataModyfikacji: book.dataModyfikacji ? book.dataModyfikacji.toISOString() : null,
    // Upewnij się, że wszystkie powiązane dane, które mogą zawierać Date/Decimal,
    // są również odpowiednio serializowane, jeśli BookGrid jest komponentem klienckim.
    // Przykład dla zdjęć i autorów, jeśli miałyby takie pola:
    // zdjecia: book.zdjecia.map(z => ({ ...z, /* ewentualne konwersje */ })),
    // autorzy: book.autorzy.map(a => ({ ...a, /* ewentualne konwersje */ })),
  }));
};

export default async function HomePage() {
  let booksRaw = [];
  let error = null;

  try {
    // Teraz `prisma` odnosi się do współdzielonej instancji z @/lib/prisma
    booksRaw = await prisma.ksiazka.findMany({
      include: {
        autorzy: true,
        statusKsiazki: true,
        zdjecia: {
          where: { czyGlowne: true },
          take: 1,
        },
        gatunki: true,
      },
      orderBy: {
        dataDodania: 'desc',
      },
      take: 20,
    });
  } catch (e) {
    console.error('Failed to fetch books:', e);
    error = 'Nie udało się załadować książek. Spróbuj ponownie później.';
  }

  // Serializacja danych jest potrzebna, jeśli BookGrid jest komponentem klienckim ('use client')
  // ponieważ obiekty Date i Decimal nie są bezpośrednio serializowalne do JSON.
  const books = booksRaw.length > 0 ? serializeBooks(booksRaw) : [];

  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Witaj w E-Kwariat!
            </h1>
            <p className="text-lg text-gray-600">
              Odkryj unikalne książki z drugiej ręki.
            </p>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Ostatnio Dodane
            </h2>

            {error && (
                <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">
                  {error}
                </p>
            )}

            {!error && books.length > 0 && <BookGrid books={books} />}

            {!error && books.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                  Wygląda na to, że nie mamy jeszcze żadnych książek w ofercie.
                </p>
            )}
          </section>
        </main>
      </div>
  );
}