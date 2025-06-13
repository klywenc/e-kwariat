// src/app/api/addresses/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/addresses - Pobierz adresy zalogowanego użytkownika
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    const addresses = await prisma.adres.findMany({
      where: { uzytkownikId: user.id },
      orderBy: { czyDomyslny: 'desc' } // Domyślny adres jako pierwszy
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Błąd podczas pobierania adresów:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// POST /api/addresses - Dodaj nowy adres dla zalogowanego użytkownika
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    const data = await request.json();
    // Prosta walidacja
    if (!data.ulica || !data.numerDomu || !data.kodPocztowy || !data.miasto) {
      return NextResponse.json({ error: 'Wymagane pola: ulica, numer domu, kod pocztowy, miasto.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    if (!user) {
      return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    // Jeśli nowy adres ma być domyślny, najpierw odznacz wszystkie inne jako niedomyślne
    if (data.czyDomyslny) {
      await prisma.adres.updateMany({
        where: { uzytkownikId: user.id },
        data: { czyDomyslny: false }
      });
    }

    const newAddress = await prisma.adres.create({
      data: {
        ulica: data.ulica,
        numerDomu: data.numerDomu,
        numerMieszkania: data.numerMieszkania,
        kodPocztowy: data.kodPocztowy,
        miasto: data.miasto,
        kraj: data.kraj || 'Polska',
        czyDomyslny: data.czyDomyslny || false,
        uzytkownikId: user.id,
      }
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania adresu:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}