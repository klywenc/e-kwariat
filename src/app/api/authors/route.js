// src/app/api/authors/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const authors = await prisma.autor.findMany({
      orderBy: [ // Sortuj najpierw po nazwisku, potem po imieniu
        { nazwisko: 'asc' },
        { imie: 'asc' },
      ],
      select: {
        id: true,
        imie: true,
        nazwisko: true,
        // Możesz dodać pole do wyświetlania, np. konkatenację imienia i nazwiska,
        // ale lepiej to robić po stronie klienta
      }
    });
    // Możesz chcieć sformatować nazwę autora do wyświetlania w selekcie
    const formattedAuthors = authors.map(author => ({
        id: author.id,
        nazwa: `${author.nazwisko}${author.imie ? `, ${author.imie}` : ''}` // Format "Nazwisko, Imię"
    }));
    return NextResponse.json(formattedAuthors);
  } catch (error) {
    console.error('Błąd podczas pobierania autorów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać autorów' }, { status: 500 });
  }
}