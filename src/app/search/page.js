// app/search/page.js
import { PrismaClient } from '@prisma/client';
import BookGrid from '@/app/components/BookGrid';
// Navbar i Footer są w Layout.js, więc nie importujemy ich tutaj
import Link from 'next/link';

const prisma = new PrismaClient();

// Funkcja serializacji pozostaje bez zmian
const serializeBooks = (booksToSerialize) => {
  return booksToSerialize.map(book => ({
    ...book,
    cena: book.cena.toNumber(),
    dataDodania: book.dataDodania.toISOString(),
    dataModyfikacji: book.dataModyfikacji ? book.dataModyfikacji.toISOString() : null,
  }));
};

// Zaktualizowana funkcja buildWhereClause (przyjmuje tylko searchTerm)
function buildWhereClause(searchTerm) { // Usunięto parametr 'category'
    const conditions = [];
    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
      searchWords.forEach(word => {
          conditions.push({
              OR: [
                { tytul: { contains: word } }, // Usunięto mode: 'insensitive' (zgodnie z poprzednimi ustaleniami dla SQLite)
                { autorzy: { some: { OR: [ { imie: { contains: word } }, { nazwisko: { contains: word } } ] } } },
              ],
          });
      });
    }
    // Usunięto blok 'if (category)'

    if (conditions.length === 0) return {}; // Jeśli brak searchTerm, zwróć wszystkie (lub obsłuż inaczej)
    return { AND: conditions };
}

export default async function SearchPage({ searchParams }) {
  const searchTerm = searchParams.q || '';
  // const category = searchParams.category || ''; // USUNIĘTE

  let booksRaw = [];
  let error = null;
  let totalBooks = 0;

  // Przekazujemy tylko searchTerm do buildWhereClause
  const whereClause = buildWhereClause(searchTerm);

  try {
    booksRaw = await prisma.ksiazka.findMany({
      where: whereClause,
      include: {
        autorzy: true,
        statusKsiazki: true,
        zdjecia: {
          where: { czyGlowne: true },
          take: 1,
        },
        gatunki: true, // Zostawiamy, bo może być potrzebne do wyświetlania w BookCard
      },
      orderBy: {
        dataDodania: 'desc',
      },
    });

    totalBooks = await prisma.ksiazka.count({ where: whereClause });
  } catch (e) {
    console.error('Failed to fetch search results:', e);
    error = 'Nie udało się załadować wyników wyszukiwania. Spróbuj ponownie później.';
  }

  const books = booksRaw.length > 0 ? serializeBooks(booksRaw) : [];

  const hasSearchParams = !!searchTerm; // Teraz zależy tylko od searchTerm
  const searchDescriptionParts = [];
  if (searchTerm) searchDescriptionParts.push(<>Szukana fraza: <span className="font-semibold">{searchTerm}</span></>);
  // Usunięto logikę dla 'category' w opisie

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar i Footer są w Layout.js */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {hasSearchParams ? "Wyniki wyszukiwania" : "Wszystkie książki"}
          </h1>
          {hasSearchParams && ( // Wyświetlamy tylko jeśli jest searchTerm
            <p className="text-md text-gray-600 mt-1">
              Szukana fraza: <span className="font-semibold">{searchTerm}</span>.
              Znaleziono: {totalBooks} {totalBooks === 1 ? 'książkę' : (totalBooks % 10 >= 2 && totalBooks % 10 <= 4 && (totalBooks % 100 < 10 || totalBooks % 100 >= 20)) ? 'książki' : 'książek'}.
            </p>
          )}
           {!hasSearchParams && totalBooks > 0 && (
             <p className="text-md text-gray-600 mt-1">
              Przeglądasz wszystkie dostępne książki. Znaleziono: {totalBooks} {totalBooks === 1 ? 'książkę' : (totalBooks % 10 >= 2 && totalBooks % 10 <= 4 && (totalBooks % 100 < 10 || totalBooks % 100 >= 20)) ? 'książki' : 'książek'}.
            </p>
          )}
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">
            {error}
          </p>
        )}

        {!error && books.length > 0 && <BookGrid books={books} />}

        {!error && books.length === 0 && !error && (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Brak wyników</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasSearchParams ? "Nie znaleziono książek pasujących do Twojej frazy. Spróbuj wpisać coś innego." : "Wygląda na to, że nie mamy jeszcze żadnych książek w ofercie."}
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Wróć na stronę główną
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}