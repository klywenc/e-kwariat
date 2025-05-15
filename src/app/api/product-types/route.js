// src/app/api/product-types/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Użyj swojej współdzielonej instancji Prisma

export async function GET() {
  try {
    const productTypes = await prisma.typProduktu.findMany({
      orderBy: {
        nazwa: 'asc', // Sortuj alfabetycznie według nazwy
      },
      select: { // Wybierz tylko potrzebne pola
        id: true,
        nazwa: true,
        slug: true, // Możesz też zwrócić slug, jeśli będzie potrzebny
      }
    });
    return NextResponse.json(productTypes);
  } catch (error) {
    console.error('Błąd podczas pobierania typów produktów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać typów produktów' }, { status: 500 });
  }
}