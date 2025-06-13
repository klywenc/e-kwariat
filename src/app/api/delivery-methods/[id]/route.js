// src/app/api/delivery-methods/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT /api/delivery-methods/[id] - Aktualizuj metodę dostawy (tylko dla admina)
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.nazwa || data.koszt === undefined) {
      return NextResponse.json({ error: 'Nazwa i koszt są wymagane.' }, { status: 400 });
    }

    const updatedMethod = await prisma.metodaDostawy.update({
      where: { id: id },
      data: {
        nazwa: data.nazwa,
        koszt: parseFloat(data.koszt),
        przewidywanyCzasDostawy: data.przewidywanyCzasDostawy,
        czyAktywna: data.czyAktywna,
      }
    });

    return NextResponse.json(updatedMethod);
  } catch (error) {
    console.error('Błąd podczas aktualizacji metody dostawy:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Metoda dostawy nie znaleziona' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// DELETE /api/delivery-methods/[id] - Usuń metodę dostawy (tylko dla admina)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID' }, { status: 400 });
    }

    await prisma.metodaDostawy.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Metoda dostawy usunięta pomyślnie' });
  } catch (error) {
    console.error('Błąd podczas usuwania metody dostawy:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Metoda dostawy nie znaleziona' }, { status: 404 });
    }
    if (error.code === 'P2003') {
        return NextResponse.json({ error: 'Nie można usunąć metody dostawy, ponieważ jest powiązana z istniejącymi zamówieniami.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}