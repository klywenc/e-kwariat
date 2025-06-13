// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { adresDostawyId, metodaDostawyId, uwagiKlienta } = await request.json();

    if (!adresDostawyId || !metodaDostawyId) {
      return NextResponse.json({ error: 'Adres i metoda dostawy są wymagane.' }, { status: 400 });
    }

    // Używamy transakcji, aby zapewnić spójność danych
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Pobierz użytkownika i jego koszyk z produktami
      const user = await tx.user.findUnique({
        where: { email: session.user.email },
        include: {
          koszyk: {
            include: {
              pozycje: {
                include: {
                  produkt: {
                    include: { statusProduktu: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!user || !user.koszyk || user.koszyk.pozycje.length === 0) {
        throw new Error('Koszyk jest pusty lub nie istnieje.');
      }

      // 2. Sprawdź, czy wszystkie produkty w koszyku są dostępne
      for (const item of user.koszyk.pozycje) {
        if (item.produkt.statusProduktu.nazwa !== 'Dostępny') {
          throw new Error(`Produkt "${item.produkt.tytul}" nie jest już dostępny.`);
        }
      }

      // 3. Pobierz dane metody dostawy, aby uzyskać koszt
      const metodaDostawy = await tx.metodaDostawy.findUnique({
        where: { id: parseInt(metodaDostawyId) }
      });
      if (!metodaDostawy) {
        throw new Error('Wybrana metoda dostawy jest nieprawidłowa.');
      }
      const kosztDostawy = metodaDostawy.koszt;

      // 4. Oblicz łączną wartość produktów
      const lacznaWartoscProduktow = user.koszyk.pozycje.reduce((sum, item) => {
        return sum + (item.ilosc * item.produkt.cena.toNumber());
      }, 0);

      // 5. Stwórz unikalny numer zamówienia
      const numerZamowienia = `EKW-${Date.now()}-${user.id}`;

      // 6. Pobierz domyślny status "Nowe" dla zamówienia
      const statusNowe = await tx.statusZamowienia.findUnique({
        where: { nazwa: 'Nowe' }
      });
      if (!statusNowe) {
        throw new Error('Brak domyślnego statusu "Nowe" dla zamówienia. Skontaktuj się z administratorem.');
      }

      // 7. Stwórz zamówienie
      const createdOrder = await tx.zamowienie.create({
        data: {
          numerZamowienia: numerZamowienia,
          lacznaWartosc: lacznaWartoscProduktow,
          kosztDostawy: kosztDostawy,
          uwagiKlienta: uwagiKlienta || null,
          uzytkownikId: user.id,
          adresDostawyId: parseInt(adresDostawyId),
          metodaDostawyId: parseInt(metodaDostawyId),
          statusZamowieniaId: statusNowe.id,
          // Stwórz pozycje zamówienia na podstawie pozycji z koszyka
          pozycje: {
            create: user.koszyk.pozycje.map(item => ({
              produktId: item.produktId,
              ilosc: item.ilosc,
              cenaJednostkowa: item.produkt.cena,
            }))
          }
        }
      });

      // 8. Zmień status produktów na "Sprzedany" (lub "Zarezerwowany")
      const produktIdsToUpdate = user.koszyk.pozycje.map(item => item.produktId);
      const statusSprzedany = await tx.statusProduktu.findUnique({ where: { nazwa: 'Wyprzedany' } }); // lub 'Zarezerwowany'
      if (!statusSprzedany) {
        throw new Error('Brak statusu "Wyprzedany" dla produktów.');
      }
      await tx.produkt.updateMany({
        where: { id: { in: produktIdsToUpdate } },
        data: { statusProduktuId: statusSprzedany.id }
      });

      // 9. Wyczyść koszyk użytkownika (usuń wszystkie pozycje)
      await tx.pozycjaKoszyka.deleteMany({
        where: { koszykId: user.koszyk.id }
      });

      return createdOrder;
    });

    return NextResponse.json({ success: true, orderId: newOrder.id, numerZamowienia: newOrder.numerZamowienia }, { status: 201 });

  } catch (error) {
    console.error('Błąd podczas tworzenia zamówienia:', error);
    return NextResponse.json({ error: error.message || 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}