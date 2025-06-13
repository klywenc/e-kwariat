// app/api/reservations/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 });
    }

    const { produktId } = await request.json();
    const uzytkownikId = parseInt(session.user.id, 10);

    if (!produktId) {
        return NextResponse.json({ error: 'Brak ID produktu.' }, { status: 400 });
    }

    try {
        const existingReservation = await prisma.rezerwacja.findUnique({
            where: { produktId: produktId },
        });

        if (existingReservation) {
            // --- ANULOWANIE REZERWACJI ---
            if (existingReservation.uzytkownikId === uzytkownikId) {
                // Używamy transakcji, aby obie operacje się udały lub żadna
                await prisma.$transaction([
                    // 1. Usuń rezerwację
                    prisma.rezerwacja.delete({ where: { id: existingReservation.id } }),
                    // 2. Zaktualizuj flagę w produkcie
                    prisma.produkt.update({
                        where: { id: produktId },
                        data: { czyZarezerwowany: false },
                    }),
                ]);
                return NextResponse.json({ message: 'Rezerwacja została anulowana.' });
            } else {
                return NextResponse.json({ error: 'Produkt jest zarezerwowany przez innego użytkownika.' }, { status: 403 });
            }
        } else {
            // --- TWORZENIE NOWEJ REZERWACJI ---
            // Używamy transakcji, aby obie operacje się udały lub żadna
            await prisma.$transaction([
                // 1. Stwórz nową rezerwację
                prisma.rezerwacja.create({
                    data: {
                        produktId: produktId,
                        uzytkownikId: uzytkownikId,
                    },
                }),
                // 2. Zaktualizuj flagę w produkcie
                prisma.produkt.update({
                    where: { id: produktId },
                    data: { czyZarezerwowany: true },
                }),
            ]);
            return NextResponse.json({ message: 'Produkt został zarezerwowany.' });
        }
    } catch (error) {
        console.error('Błąd podczas zarządzania rezerwacją:', error);
        return NextResponse.json({ error: 'Nie udało się przetworzyć żądania.' }, { status: 500 });
    }
}