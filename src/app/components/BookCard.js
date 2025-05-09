'use client';

import Link from 'next/link';
import Image from 'next/image'; // Używamy Next.js Image dla optymalizacji
import { useState } from 'react';
import { useSession } from 'next-auth/react';
// Usunięto import typu BookWithDetails

// Usunięto interfejs BookCardProps

// W parametrach usunięto typowanie : BookCardProps
export default function BookCard({ book }) {
  const { data: session } = useSession();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  const authors = book.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`).join(', ');

  const price = book.cena ? `${book.cena.toFixed(2)} zł` : 'N/A';

  const mainImage = book.zdjecia && book.zdjecia[0]?.url; // Sprawdzamy czy zdjecia istnieją

  // Placeholder, jeśli nie ma obrazka
  const placeholderImage = "/images/cover.png"; // Upewnij się, że masz taki plik w public/images

  const isAvailable = book.statusKsiazki?.nazwa === 'Dostępna';

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ksiazkaId: book.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Nie udało się dodać do koszyka');
      }

      // Optional: Show success message or update UI
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
      <div className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        <Link href={`/product/${book.id}`} className="block">
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
        </Link>

        <div className="px-4 pb-4">
          <button
              onClick={handleAddToCart}
              disabled={!isAvailable || isAddingToCart}
              className={`cursor-pointer w-full py-2 rounded transition duration-200 ${
                  isAvailable
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isAddingToCart ? (
                <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Dodawanie...
            </span>
            ) : isAvailable ? (
                'Dodaj do koszyka'
            ) : (
                'Niedostępna'
            )}
          </button>
          {error && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {error}
              </p>
          )}
        </div>
      </div>
  );
}