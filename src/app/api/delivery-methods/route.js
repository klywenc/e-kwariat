// src/app/api/delivery-methods/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/delivery-methods - Pobierz metody dostawy
// Domyślnie pobiera tylko aktywne. Admin może zażądać wszystkich.
export async function GET(request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get('all') === 'true';

  try {
    const whereClause = {};
    // Jeśli użytkownik nie jest adminem, zawsze pokazuj tylko aktywne
    if (session?.user?.role !== 'ADMIN' || !showAll) {
      whereClause.czyAktywna = true;
    }

    const deliveryMethods = await prisma.metodaDostawy.findMany({
      where: whereClause,
      orderBy: { koszt: 'asc' },
    });

    // Serializacja Decimal na number
    const serializedMethods = deliveryMethods.map(method => ({
      ...method,
      koszt: method.koszt.toNumber(),
    }));

    return NextResponse.json(serializedMethods);
  } catch (error) {
    console.error('Błąd podczas pobierania metod dostawy:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// POST /api/delivery-methods - Dodaj nową metodę dostawy (tylko dla admina)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
  }

  try {
    const data = await request.json();
    if (!data.nazwa || data.koszt === undefined) {
      return NextResponse.json({ error: 'Nazwa i koszt są wymagane.' }, { status: 400 });
    }

    const newMethod = await prisma.metodaDostawy.create({
      data: {
        nazwa: data.nazwa,
        koszt: parseFloat(data.koszt),
        przewidywanyCzasDostawy: data.przewidywanyCzasDostawy,
        czyAktywna: data.czyAktywna || false,
      }
    });

    return NextResponse.json(newMethod, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas tworzenia metody dostawy:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}