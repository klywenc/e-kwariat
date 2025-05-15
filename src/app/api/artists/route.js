// src/app/api/artists/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const artists = await prisma.artysta.findMany({
      orderBy: [
        { nazwisko: 'asc' },
        { imie: 'asc' },
      ],
      select: {
        id: true,
        imie: true,
        nazwisko: true,
        rola: true, // Możesz chcieć zwrócić rolę, jeśli jest istotna
      }
    });
    // Podobnie jak u autorów, formatowanie nazwy
    const formattedArtists = artists.map(artist => ({
        id: artist.id,
        nazwa: `${artist.nazwisko}${artist.imie ? `, ${artist.imie}` : ''}${artist.rola ? ` (${artist.rola})` : ''}`
    }));
    return NextResponse.json(formattedArtists);
  } catch (error) {
    console.error('Błąd podczas pobierania artystów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać artystów' }, { status: 500 });
  }
}