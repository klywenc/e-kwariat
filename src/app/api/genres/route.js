// src/app/api/genres/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const genres = await prisma.gatunek.findMany({
      orderBy: {
        nazwa: 'asc',
      },
      select: {
        id: true,
        nazwa: true,
      }
    });
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Błąd podczas pobierania gatunków:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać gatunków' }, { status: 500 });
  }
}