import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function HomePage() {
  let books = [];
  let error = null;

  try {
    books = await prisma.ksiazka.findMany({
      include: {
        autorzy: true,
        statusKsiazki: true,
      },
      orderBy: {
        tytul: 'asc',
      },
    });
  } catch (e) {
    console.error("Failed to fetch books:", e);
    error = "Nie udało się załadować książek.";
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Książki w E-Kwariat</h1>
              <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Zaloguj się
                </Link>
                <Link
                    href="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Zarejestruj się
                </Link>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {!error && books.length > 0 && (
                <div className="w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tytuł
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Autorzy
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cena
                      </th>
                      <th scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                        <tr key={book.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {book.tytul} {book.rokWydania ? `(${book.rokWydania})` : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`).join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {typeof book.cena === 'string' || typeof book.cena === 'number'
                                ? parseFloat(book.cena).toFixed(2) + ' zł'
                                : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.statusKsiazki?.nazwa || 'Brak statusu'}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}

            {!error && books.length === 0 && (
                <p>Brak książek w bazie danych.</p>
            )}
          </div>
        </div>
      </main>
  );
}