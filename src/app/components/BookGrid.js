// app/components/BookGrid.js
import BookCard from './BookCard'; // Upewnij się, że BookCard jest komponentem klienckim ('use client') jeśli wykonuje logikę kliencką

// Komponent BookGrid sam w sobie może pozostać komponentem serwerowym,
// jeśli tylko mapuje i przekazuje dane.
// Jeśli BookGrid miałby stany, efekty itp., musiałby być 'use client'.
// Na podstawie kodu, który podałeś, może być serwerowy.

export default function BookGrid({ books }) {
  // books tutaj to już tablica zserializowanych obiektów książek
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        // book.id nadal jest dostępne i jest typu Int (number)
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}