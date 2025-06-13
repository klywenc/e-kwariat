// app/api/products/[id]/reservation-status/route.js

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const productId = parseInt(params.id, 10);
        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const reservation = await prisma.rezerwacja.findUnique({
            where: {
                produktId: productId,
            },
        });

        // Zwracamy prostą odpowiedź: czy rezerwacja istnieje, czy nie.
        return NextResponse.json({ isReserved: !!reservation });

    } catch (error) {
        console.error('Error fetching reservation status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}