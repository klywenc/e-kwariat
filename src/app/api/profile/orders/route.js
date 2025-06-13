// src/app/api/profile/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    const orders = await prisma.zamowienie.findMany({
      where: { uzytkownikId: user.id },
      include: {
        statusZamowienia: true, // Dołączamy status, aby wyświetlić jego nazwę
        pozycje: { // Dołączamy pozycje, aby wiedzieć, ile było produktów
          select: {
            id: true, // Wystarczy nam ID lub po prostu zliczenie
          }
        }
      },
      orderBy: {
        dataZlozenia: 'desc' // Najnowsze zamówienia na górze
      }
    });

    // Serializacja danych Decimal
    const serializedOrders = orders.map(order => ({
      ...order,
      lacznaWartosc: order.lacznaWartosc.toNumber(),
      kosztDostawy: order.kosztDostawy.toNumber(),
    }));

    return NextResponse.json(serializedOrders);

  } catch (error) {
    console.error('Błąd podczas pobierania historii zamówień:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}