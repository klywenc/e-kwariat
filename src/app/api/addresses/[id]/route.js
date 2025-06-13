// src/app/api/addresses/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT /api/addresses/[id] - Aktualizuj adres
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    const addressId = parseInt(params.id, 10);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID adresu' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.ulica || !data.numerDomu || !data.kodPocztowy || !data.miasto) {
      return NextResponse.json({ error: 'Wymagane pola: ulica, numer domu, kod pocztowy, miasto.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });

    // Sprawdź, czy adres należy do użytkownika
    const addressToUpdate = await prisma.adres.findUnique({ where: { id: addressId } });
    if (!addressToUpdate || addressToUpdate.uzytkownikId !== user.id) {
      return NextResponse.json({ error: 'Brak uprawnień do edycji tego adresu' }, { status: 403 });
    }

    // Jeśli ten adres ma być domyślny, odznacz inne
    if (data.czyDomyslny) {
      await prisma.adres.updateMany({
        where: { uzytkownikId: user.id, NOT: { id: addressId } },
        data: { czyDomyslny: false }
      });
    }

    const updatedAddress = await prisma.adres.update({
      where: { id: addressId },
      data: {
        ulica: data.ulica,
        numerDomu: data.numerDomu,
        numerMieszkania: data.numerMieszkania,
        kodPocztowy: data.kodPocztowy,
        miasto: data.miasto,
        kraj: data.kraj || 'Polska',
        czyDomyslny: data.czyDomyslny || false,
      }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Błąd podczas aktualizacji adresu:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// DELETE /api/addresses/[id] - Usuń adres
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
  }

  try {
    const addressId = parseInt(params.id, 10);
    if (isNaN(addressId)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID adresu' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });

    // Sprawdź, czy adres należy do użytkownika
    const addressToDelete = await prisma.adres.findUnique({ where: { id: addressId } });
    if (!addressToDelete || addressToDelete.uzytkownikId !== user.id) {
      return NextResponse.json({ error: 'Brak uprawnień do usunięcia tego adresu' }, { status: 403 });
    }

    await prisma.adres.delete({
      where: { id: addressId }
    });

    return NextResponse.json({ message: 'Adres usunięty pomyślnie' });
  } catch (error) {
    console.error('Błąd podczas usuwania adresu:', error);
    if (error.code === 'P2003') { // Foreign key constraint failed
        return NextResponse.json({ error: 'Nie można usunąć adresu, ponieważ jest powiązany z istniejącym zamówieniem.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}