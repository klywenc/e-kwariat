import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const offers = await prisma.ksiazka.findMany({
      include: {
        statusKsiazki: true,
      },
      orderBy: {
        tytul: 'asc',
      },
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const offer = await prisma.ksiazka.create({
      data: {
        tytul: data.tytul,
        rokWydania: data.rokWydania ? parseInt(data.rokWydania) : null,
        cena: parseFloat(data.cena),
        opisStanu: data.opisStanu,
        statusKsiazkiId: data.statusKsiazkiId,
      },
    });
    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
} 