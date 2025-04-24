// src/app/components/SearchFilterBar.js
'use client';

import { useState } from 'react';

export default function SearchFilterBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const handleSearch = () => {
    console.log('Wyszukiwanie:', { searchTerm, selectedGenre, sortOrder });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row gap-4 items-center">
      {/* --- Input Wyszukiwania --- */}
      <div className="flex-grow w-full md:w-auto">
        <input
          type="search"
          placeholder="Wpisz tytuł, autora lub ISBN..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-500 text-gray-900" // <--- DODANA KLASA text-gray-900
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ... reszta kodu dla selectów i przycisku ... */}
       {/* --- Select Gatunku --- */}
       <div className="w-full md:w-auto">
        <select
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
            selectedGenre === '' ? 'text-gray-500' : 'text-gray-900' // Kolor tekstu opcji
          }`}
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="" disabled={selectedGenre !== ''}>
            Wszystkie gatunki
          </option>
          {/* <option value="fantastyka">Fantastyka</option> */}
          {/* <option value="kryminal">Kryminał</option> */}
        </select>
      </div>

      {/* --- Select Sortowania --- */}
      <div className="w-full md:w-auto">
        <select
          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`} // Kolor tekstu opcji
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Najnowsze</option>
          <option value="price_asc">Cena rosnąco</option>
          <option value="price_desc">Cena malejąco</option>
          <option value="title_asc">Tytuł A-Z</option>
        </select>
      </div>

      {/* --- Przycisk Szukaj --- */}
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 w-full md:w-auto"
        onClick={handleSearch}
      >
        Szukaj
      </button>
    </div>
  );
}