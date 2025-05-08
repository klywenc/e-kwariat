// app/page.js
import { PrismaClient } from '@prisma/client';
import BookGrid from '@/app/components/BookGrid';

const prisma = new PrismaClient();

// Funkcja pomocnicza do serializacji książek
const serializeBooks = (booksToSerialize) => {
  return booksToSerialize.map(book => ({
    ...book,
    cena: book.cena.toNumber(), // Konwersja Decimal na number
    dataDodania: book.dataDodania.toISOString(), // Konwersja Date na ISO string
    // Jeśli dataModyfikacji może być null, dodaj warunek
    dataModyfikacji: book.dataModyfikacji ? book.dataModyfikacji.toISOString() : null,
    // Sprawdź, czy zagnieżdżone obiekty (autorzy, statusKsiazki, zdjecia, gatunki)
    // nie zawierają również pól Date/Decimal, które trzeba by zserializować.
    // Na podstawie Twojego schematu, główne problemy są na poziomie obiektu Ksiazka.
    // Przykład dla zdjęcia, jeśli miałoby datę:
    // zdjecia: book.zdjecia.map(zdjecie => ({
    //   ...zdjecie,
    //   dataUtworzeniaZdjecia: zdjecie.dataUtworzeniaZdjecia ? zdjecie.dataUtworzeniaZdjecia.toISOString() : null,
    // })),
  }));
};

export default async function HomePage() {
  let booksRaw = [];
  let error = null;

  try {
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

  // Serializuj dane przed przekazaniem do komponentu klienckiego
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

          {!error && books.length === 0 && !error && ( // Dodano !error dla spójności
            <p className="text-center text-gray-500 mt-10">
              Wygląda na to, że nie mamy jeszcze żadnych książek w ofercie.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}