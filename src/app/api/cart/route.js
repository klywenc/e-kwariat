// src/app/api/cart/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma'; // Użyj współdzielonej instancji Prisma
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Upewnij się, że ścieżka jest poprawna

// const prisma = new PrismaClient(); // Usuń, jeśli używasz współdzielonej instancji

// GET /api/cart - Pobierz koszyk użytkownika
export async function GET(request) { // Dodano request, chociaż nie jest używany, dla spójności z innymi metodami
  try {
    const session = await getServerSession(authOptions); // Przekaż authOptions
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        koszyk: {
          include: {
            pozycje: {
              orderBy: { id: 'asc' }, // Opcjonalnie: sortuj pozycje
              include: {
                produkt: { // ZMIANA: z ksiazka na produkt
                  include: {
                    zdjecia: { where: { czyGlowne: true }, take: 1 }, // Pobierz tylko główne zdjęcie
                    typProduktu: true, // Aby znać typ produktu
                    // Możesz dołączyć podstawowe dane specyficzne, jeśli są potrzebne w podsumowaniu koszyka
                    // np. daneKsiazki: { select: { rokWydania: true, autorzy: { select: { nazwisko: true, imie: true } } } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user?.koszyk) {
      // Jeśli użytkownik nie ma koszyka, zwróć pusty koszyk (lub utwórz go, jeśli taka jest logika)
      return NextResponse.json({ id: null, uzytkownikId: user.id, pozycje: [] });
    }

    // Dodajemy informację o łącznej wartości koszyka, jeśli potrzebne
    // (to można też liczyć po stronie klienta)
    // const total = user.koszyk.pozycje.reduce((sum, item) => sum + (item.ilosc * item.produkt.cena.toNumber()), 0);

    return NextResponse.json(user.koszyk);
  } catch (error) {
    console.error('Błąd podczas pobierania koszyka:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// POST /api/cart - Dodaj produkt do koszyka
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { produktId, ilosc = 1 } = await request.json(); // ZMIANA: ksiazkaId na produktId, dodano opcjonalną ilość

    if (!produktId) {
      return NextResponse.json({ error: 'ID produktu jest wymagane' }, { status: 400 });
    }
    if (typeof ilosc !== 'number' || ilosc <= 0) {
        return NextResponse.json({ error: 'Nieprawidłowa ilość' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      // Nie potrzebujemy include: { koszyk: true } na tym etapie, jeśli zawsze tworzymy/aktualizujemy
    });

    if (!user) {
        return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });
    }

    // Znajdź lub utwórz koszyk dla użytkownika
    let koszyk = await prisma.koszyk.findUnique({
      where: { uzytkownikId: user.id },
    });

    if (!koszyk) {
      koszyk = await prisma.koszyk.create({
        data: { uzytkownikId: user.id },
      });
    }

    // Sprawdź, czy produkt już istnieje w koszyku
    const existingItem = await prisma.pozycjaKoszyka.findUnique({
      where: {
        koszykId_produktId: { // ZMIANA: unikalny identyfikator
          koszykId: koszyk.id,
          produktId: produktId,
        }
      }
    });

    let updatedCart;

    if (existingItem) {
      // Jeśli produkt istnieje, zaktualizuj ilość
      updatedCart = await prisma.koszyk.update({
        where: { id: koszyk.id },
        data: {
          pozycje: {
            update: {
              where: { id: existingItem.id },
              data: { ilosc: existingItem.ilosc + ilosc },
            }
          }
        },
        include: { // Dołącz zaktualizowane pozycje
          pozycje: { include: { produkt: { include: { zdjecia: { where: { czyGlowne: true }, take: 1 } } } } }
        }
      });
      return NextResponse.json({ message: 'Ilość produktu w koszyku zaktualizowana.', koszyk: updatedCart });
    } else {
      // Jeśli produkt nie istnieje, dodaj nową pozycję
      updatedCart = await prisma.koszyk.update({
        where: { id: koszyk.id },
        data: {
          pozycje: {
            create: {
              produktId: produktId,
              ilosc: ilosc,
            }
          }
        },
        include: { // Dołącz zaktualizowane pozycje
          pozycje: { include: { produkt: { include: { zdjecia: { where: { czyGlowne: true }, take: 1 } } } } }
        }
      });
      return NextResponse.json({ message: 'Produkt dodany do koszyka.', koszyk: updatedCart });
    }

  } catch (error) {
    console.error('Błąd podczas dodawania do koszyka:', error);
    if (error.code === 'P2003') { // Foreign key constraint failed
        return NextResponse.json({ error: 'Podany produkt nie istnieje.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}

// PUT /api/cart - Zaktualizuj ilość produktu w koszyku
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { produktId, ilosc } = await request.json();

    if (!produktId || typeof ilosc !== 'number' || ilosc <= 0) {
      return NextResponse.json({ error: 'ID produktu i prawidłowa ilość są wymagane' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 });

    const koszyk = await prisma.koszyk.findUnique({ where: { uzytkownikId: user.id } });
    if (!koszyk) return NextResponse.json({ error: 'Koszyk nie znaleziony' }, { status: 404 });

    const updatedPozycja = await prisma.pozycjaKoszyka.update({
      where: {
        koszykId_produktId: { // ZMIANA
          koszykId: koszyk.id,
          produktId: produktId,
        }
      },
      data: { ilosc: ilosc },
    });

    // Pobierz zaktualizowany cały koszyk
    const updatedCart = await prisma.koszyk.findUnique({
      where: { id: koszyk.id },
      include: { pozycje: { include: { produkt: { include: { zdjecia: { where: { czyGlowne: true }, take: 1 } } } } } }
    });

    return NextResponse.json({ message: 'Ilość produktu zaktualizowana.', koszyk: updatedCart });
  } catch (error) {
    console.error('Błąd podczas aktualizacji koszyka:', error);
    if (error.code === 'P2025') { // Record to update not found
        return NextResponse.json({ error: 'Produkt nie znaleziony w koszyku.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}


// DELETE /api/cart - Usuń produkt z koszyka
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const produktIdParam = searchParams.get('produktId'); // ZMIANA: z ksiazkaId na produktId

    if (!produktIdParam) {
      return NextResponse.json({ error: 'ID produktu jest wymagane' }, { status: 400 });
    }
    const produktId = parseInt(produktIdParam, 10);
    if (isNaN(produktId)) {
        return NextResponse.json({ error: 'Nieprawidłowe ID produktu' }, { status: 400 });
    }


    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { koszyk: true } // Potrzebujemy ID koszyka
    });

    if (!user?.koszyk) {
      return NextResponse.json({ error: 'Koszyk nie znaleziony' }, { status: 404 });
    }

    await prisma.pozycjaKoszyka.delete({
      where: {
        koszykId_produktId: { // ZMIANA
          koszykId: user.koszyk.id,
          produktId: produktId,
        }
      }
    });

    // Pobierz zaktualizowany koszyk
    const updatedCart = await prisma.koszyk.findUnique({
      where: { id: user.koszyk.id },
      include: {
        pozycje: {
          include: {
            produkt: { // ZMIANA
              include: {
                zdjecia: { where: { czyGlowne: true }, take: 1 },
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ message: 'Produkt usunięty z koszyka.', koszyk: updatedCart || { id: user.koszyk.id, uzytkownikId: user.id, pozycje: [] } });
  } catch (error) {
    console.error('Błąd podczas usuwania z koszyka:', error);
    if (error.code === 'P2025') { // Record to delete not found
        return NextResponse.json({ error: 'Produkt nie znaleziony w koszyku.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}