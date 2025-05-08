'use client';

import BookCard from './BookCard';
// Usunięto import typu BookWithDetails

// Usunięto interfejs BookGridProps

// W parametrach usunięto typowanie : BookGridProps
export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}