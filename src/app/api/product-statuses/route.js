// src/app/api/product-statuses/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const productStatuses = await prisma.statusProduktu.findMany({
      orderBy: {
        // Możesz chcieć specyficznej kolejności, np. "Dostępny" jako pierwszy
        // Jeśli nie, sortowanie po nazwie lub ID jest OK
        id: 'asc',
      },
      select: {
        id: true,
        nazwa: true,
      }
    });
    return NextResponse.json(productStatuses);
  } catch (error) {
    console.error('Błąd podczas pobierania statusów produktów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać statusów produktów' }, { status: 500 });
  }
}