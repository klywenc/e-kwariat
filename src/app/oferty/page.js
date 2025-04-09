// src/app/oferty/page.js
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'; // Do potencjalnego linkowania do szczegółów oferty

// --- Singleton Prisma Client (zalecane) ---
// Utwórz plik np. lib/prisma.js i wklej tam kod singletona
// import prisma from '@/lib/prisma'; // Wtedy importuj tak
// Poniżej prosta instancja na potrzeby przykładu:
const prisma = new PrismaClient();
// -----------------------------------------

async function getOferty() {
  try {
    const oferty = await prisma.ksiazka.findMany({
      where: {
        // Chcemy tylko oferty, które są aktualnie dostępne do kupienia
        statusKsiazki: {
          nazwa: 'Dostępna',
        },
        // Można dodać inne filtry, np. wykluczyć książki bez ceny, itp.
        // cena: {
        //   not: null, // Jeśli cena może być null
        //   gt: 0      // Jeśli cena musi być większa od 0
        // }
      },
      include: {
        autorzy: { // Pobierz powiązanych autorów
          select: { imie: true, nazwisko: true } // Wybierz tylko potrzebne pola
        },
        gatunki: { // Pobierz powiązane gatunki
          select: { nazwa: true }
        },
        statusKsiazki: { // Pobierz status (choć filtrujemy, może się przydać do wyświetlenia)
          select: { nazwa: true }
        },
        zdjecia: { // Pobierz główne zdjęcie
          where: {
            czyGlowne: true,
          },
          select: { url: true, opisAlt: true },
          take: 1, // Wystarczy jedno główne zdjęcie
        },
      },
      orderBy: {
        dataDodania: 'desc', // Sortuj od najnowszych ofert
      },
    });
    return oferty;
  } catch (error) {
    console.error("Błąd podczas pobierania ofert:", error);
    // W środowisku produkcyjnym można logować błędy do systemu monitoringu
    return []; // Zwróć pustą tablicę w razie błędu, aby strona się nie wysypała
  } finally {
    // W środowiskach serverless/edge $disconnect często nie jest potrzebny/zalecany
    // await prisma.$disconnect();
  }
}

export default async function OfertyPage() {
  const oferty = await getOferty();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
        Aktualne Oferty
      </h1>

      {oferty.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          Obecnie nie mamy żadnych dostępnych ofert. Zajrzyj ponownie później!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {oferty.map((oferta) => (
            // Można owinąć Linkiem do strony szczegółów: <Link href={`/oferty/${oferta.id}`}>...</Link>
            <div
              key={oferta.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col bg-white"
            >
              <div className="relative w-full h-56 sm:h-64 bg-gray-100">
                {oferta.zdjecia && oferta.zdjecia.length > 0 ? (
                  <Image
                    src={oferta.zdjecia[0].url} // Używamy ścieżki z bazy
                    alt={oferta.zdjecia[0].opisAlt || `Okładka ${oferta.tytul}`}
                    layout="fill"
                    objectFit="contain" // 'contain' może lepiej pasować do okładek niż 'cover'
                    className="p-2" // Dodaj padding, jeśli 'contain' zostawia puste miejsce
                    priority={oferty.indexOf(oferta) < 8} // Priorytet dla pierwszych kilku obrazków
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Brak zdjęcia
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1 text-gray-800 truncate" title={oferta.tytul}>
                  {oferta.tytul}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  {oferta.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`).join(', ')}
                </p>

                {/* Opcjonalnie: Wyświetlanie gatunków */}
                {/* <p className="text-xs text-gray-400 mb-2">
                  {oferta.gatunki.map(g => g.nazwa).join(', ')}
                </p> */}

                <p className="text-sm text-gray-600 mb-3 flex-grow">
                  {oferta.opisStanu}
                </p>

                <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
                  <p className="text-xl font-bold text-blue-600">
                    {oferta.cena.toString()} zł
                  </p>
                  {/* Można dodać przycisk "Dodaj do koszyka" lub "Zobacz szczegóły" */}
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {oferta.statusKsiazki.nazwa}
                  </span>
                </div>
              </div>
            </div>
            // Koniec Linka, jeśli był używany
          ))}
        </div>
      )}
    </main>
  );
}

