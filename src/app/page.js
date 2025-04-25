import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import BookGrid from '@/app/components/BookGrid';
import SearchFilterBar from '@/app/components/SearchFilterBar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const prisma = new PrismaClient();

// Typ BookWithDetails był tylko dla TypeScript, w JS go nie potrzebujemy definiować
// ale pamiętajmy, że obiekty 'book' będą miały strukturę zgodną z zapytaniem Prisma

export default async function HomePage() {
  let books = [];
  let error = null;

  try {
    books = await prisma.ksiazka.findMany({
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
    });
  } catch (e) {
    console.error('Failed to fetch books:', e);
    error = 'Nie udało się załadować książek. Spróbuj ponownie później.';
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/*/!*<Header />*!/ old */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Witaj w E-Kwariat!
          </h1>
          <p className="text-lg text-gray-600">
            Odkryj unikalne książki z drugiej ręki.
          </p>
        </div>

        <SearchFilterBar />

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Nasze Książki
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
