// app/components/BookCard.js
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BookCard({ book }) {
  // Przetwarzanie autorów
  const authorsDisplay = book.autorzy && book.autorzy.length > 0
    ? book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ')
    : 'Autor nieznany';

  // Przetwarzanie ceny - book.cena jest już typu number po serializacji
  const formattedPrice = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(book.cena); // book.cena to już number

  // Obrazek główny i placeholder
  const mainImage = book.zdjecia && book.zdjecia.length > 0 && book.zdjecia[0]?.url
    ? book.zdjecia[0].url
    : "/images/cover.png"; // Upewnij się, że ten plik istnieje w public/images

  const imageAlt = book.zdjecia && book.zdjecia.length > 0 && book.zdjecia[0]?.opisAlt
    ? book.zdjecia[0].opisAlt
    : `Okładka książki ${book.tytul}`;

  // Formatowanie daty dodania - book.dataDodania to string ISO
  // Możemy ją wyświetlić, jeśli jest potrzebna na karcie
  // const formattedDateAdded = new Date(book.dataDodania).toLocaleDateString('pl-PL', {
  //   year: 'numeric', month: 'short', day: 'numeric'
  // });

  return (
    // Link teraz bezpośrednio owija zawartość, legacyBehavior nie jest potrzebne dla Next.js 13+ App Router
    // jeśli Link jest jedynym dzieckiem, które akceptuje ref (np. <a> lub komponent z forwardRef)
    // Jednak dla zachowania struktury z <a> wewnątrz, legacyBehavior jest OK,
    // ale można też ostylować sam Link jako block.
    // Dla prostoty zostawiam legacyBehavior, jeśli tak miałeś.
    <Link href={`/ksiazka/${book.id}`} legacyBehavior>
      <a className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col"> {/* Dodano h-full i flex flex-col */}
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={mainImage}
            alt={imageAlt}
            fill // Zastępuje layout="fill" i objectFit
            style={{ objectFit: 'cover' }} // 'cover' lub 'contain'
            className="transition-transform duration-300 group-hover:scale-105"
            priority={false} // Ustaw na true dla pierwszych kilku obrazków (LCP)
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Dostosuj wg potrzeb
            // onError nie jest już tak proste z `fill`.
            // Zamiast tego, upewnij się, że `mainImage` zawsze ma poprawną ścieżkę (do obrazka lub placeholdera).
          />
          {book.statusKsiazki?.nazwa && book.statusKsiazki.nazwa !== 'Dostępna' && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow">
              {book.statusKsiazki.nazwa}
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow"> {/* Dodano flex-grow */}
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2" title={book.tytul}> {/* line-clamp-2 dla ograniczenia do 2 linii */}
            {book.tytul} {book.rokWydania ? `(${book.rokWydania})` : ''}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1" title={authorsDisplay}> {/* line-clamp-1 */}
            {authorsDisplay}
          </p>

          {/* Opcjonalnie: Wyświetlanie gatunków */}
          {book.gatunki && book.gatunki.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-1" title={book.gatunki.map(g => g.nazwa).join(', ')}>
              {book.gatunki.map(g => g.nazwa).join(', ')}
            </p>
          )}

          <div className="mt-auto pt-3"> {/* Wypycha cenę na dół */}
            <p className="text-xl font-bold text-indigo-600">
              {formattedPrice}
            </p>
            {/* Możesz dodać datę dodania, jeśli chcesz */}
            {/* <p className="text-xs text-gray-400 mt-1">Dodano: {formattedDateAdded}</p> */}
          </div>
        </div>
      </a>
    </Link>
  );
}