import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    
    const offer = await prisma.ksiazka.update({
      where: { id: parseInt(id) },
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
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await prisma.ksiazka.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
} 