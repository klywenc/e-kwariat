'use client';

import Link from 'next/link';
import Image from 'next/image'; // Używamy Next.js Image dla optymalizacji
// Usunięto import typu BookWithDetails

// Usunięto interfejs BookCardProps

// W parametrach usunięto typowanie : BookCardProps
export default function BookCard({ book }) {
  const authors = book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`).join(', ');
  const price = typeof book.cena === 'string' || typeof book.cena === 'number'
    ? parseFloat(book.cena.toString()).toFixed(2) + ' zł' // Bezpieczniejsze parsowanie
    : 'N/A';
  const mainImage = book.zdjecia && book.zdjecia[0]?.url; // Sprawdzamy czy zdjecia istnieją

  // Placeholder, jeśli nie ma obrazka
  const placeholderImage = "/images/cover.png"; // Upewnij się, że masz taki plik w public/images

  return (
    <Link href={`/ksiazka/${book.id}`} legacyBehavior>
      <a className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        <div className="relative w-full h-64 bg-gray-200"> {/* Stała wysokość dla spójności */}
          <Image
            src={mainImage || placeholderImage}
            alt={`Okładka książki ${book.tytul}`}
            layout="fill" // Wypełnia kontener
            objectFit="cover" // Zachowuje proporcje, przycina jeśli trzeba
            className="transition-transform duration-300 group-hover:scale-105" // Efekt lekkiego zoomu
            onError={(e) => {
              // W razie błędu ładowania obrazka (np. zły URL), ustawia placeholder
              // Usunięto asercję typu 'as HTMLImageElement'
              const target = e.target;
              // Sprawdzenie czy target ma właściwości obrazka (dla bezpieczeństwa w JS)
              if (target && typeof target.srcset !== 'undefined' && typeof target.src !== 'undefined') {
                 target.srcset = placeholderImage;
                 target.src = placeholderImage;
              }
            }}
          />
           {/* Opcjonalnie: Pokaż status jeśli nie jest "Dostępna" (zakładając, że masz taki status) */}
           {book.statusKsiazki?.nazwa && book.statusKsiazki.nazwa !== 'Dostępna' && (
             <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
               {book.statusKsiazki.nazwa}
             </span>
           )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-indigo-600" title={book.tytul}>
            {book.tytul} {book.rokWydania ? `(${book.rokWydania})` : ''}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate" title={authors}>
            {authors || 'Brak autora'}
          </p>
          {/* Możesz dodać gatunki */}
          {/* <p className="text-xs text-gray-400 mt-1 truncate">
            {book.gatunki.map(g => g.nazwa).join(', ') || 'Brak gatunku'}
          </p> */}
          <p className="text-lg font-bold text-indigo-600 mt-2">
            {price}
          </p>
          {/* Możesz dodać przycisk "Dodaj do koszyka" lub "Zobacz szczegóły" */}
          {/* <button className="mt-3 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200">
            Zobacz szczegóły
          </button> */}
        </div>
      </a>
    </Link>
  );
}