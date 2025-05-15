// src/app/components/CategorySidebar.js
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Funkcja do grupowania kategorii alfabetycznie
const groupCategoriesAlphabetically = (categories) => {
  if (!categories || categories.length === 0) return {};
  return categories.reduce((acc, category) => {
    const firstLetter = category.nazwa[0]?.toUpperCase();
    if (firstLetter) {
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(category);
    }
    return acc;
  }, {});
};

export default function CategorySidebar({ initialCategories = [], currentCategorySlug }) {
  // Jeśli kategorie są przekazywane jako props (z komponentu serwerowego), nie potrzebujemy fetch
  // Jeśli sidebar ma sam pobierać, to:
  // const [categories, setCategories] = useState(initialCategories);
  // const [loading, setLoading] = useState(initialCategories.length === 0);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (initialCategories.length === 0) {
  //     const fetchCategories = async () => {
  //       try {
  //         const res = await fetch('/api/product-types');
  //         if (!res.ok) throw new Error('Failed to fetch categories');
  //         const data = await res.json();
  //         setCategories(data);
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchCategories();
  //   }
  // }, [initialCategories.length]);

  // Zakładamy, że kategorie są przekazywane jako `initialCategories`
  const groupedCategories = groupCategoriesAlphabetically(initialCategories);
  const sortedLetters = Object.keys(groupedCategories).sort();

  // if (loading) return <div className="p-4 animate-pulse">Ładowanie kategorii...</div>;
  // if (error) return <div className="p-4 text-red-500">Błąd ładowania kategorii: {error}</div>;
  if (initialCategories.length === 0) return <div className="p-4 text-sm text-gray-500">Brak kategorii do wyświetlenia.</div>;


  return (
    <aside className="w-full md:w-64 lg:w-72 xl:w-80 bg-white p-4 rounded-lg shadow-md h-fit sticky top-24"> {/* sticky top-X dostosuj do wysokości navbara */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Kategorie Produktów</h2>
      <nav>
        {sortedLetters.map((letter) => (
          <div key={letter} className="mb-3">
            <h3 className="text-lg font-medium text-indigo-600 mb-1">{letter}</h3>
            <ul className="space-y-1">
              {groupedCategories[letter].map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/?category=${category.slug}`} // Link do strony głównej z parametrem kategorii
                    scroll={false} // Zapobiega przewijaniu na górę strony przy zmianie kategorii
                    className={`block text-sm py-1 px-2 rounded hover:bg-indigo-50 transition-colors
                                ${currentCategorySlug === category.slug ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:text-indigo-600'}`}
                  >
                    {category.nazwa}
                    {/* Możesz dodać licznik, jeśli API go zwraca: ({category._count?.produkty || 0}) */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {currentCategorySlug && (
            <div className="mt-4 pt-3 border-t">
                <Link
                    href="/"
                    scroll={false}
                    className="block text-sm py-1 px-2 rounded text-red-600 hover:bg-red-50 font-medium transition-colors"
                >
                    Wyczyść filtr kategorii (X)
                </Link>
            </div>
        )}
      </nav>
    </aside>
  );
}