import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        koszyk: {
          include: {
            pozycje: {
              include: {
                ksiazka: {
                  include: {
                    zdjecia: true,
                    autorzy: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user?.koszyk) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(user.koszyk);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ksiazkaId } = await request.json();

    if (!ksiazkaId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { koszyk: true }
    });

    // Create cart if it doesn't exist
    if (!user.koszyk) {
      const newCart = await prisma.koszyk.create({
        data: {
          uzytkownikId: user.id,
          pozycje: {
            create: {
              ksiazkaId,
              
            }
          }
        },
        include: {
          pozycje: {
            include: {
              ksiazka: {
                include: {
                  zdjecia: true,
                  autorzy: true
                }
              }
            }
          }
        }
      });
      return NextResponse.json(newCart);
    }

    // Check if book already exists in cart
    const existingItem = await prisma.pozycjaKoszyka.findUnique({
      where: {
        koszykId_ksiazkaId: {
          koszykId: user.koszyk.id,
          ksiazkaId
        }
      }
    });

    if (existingItem) {
      return NextResponse.json({ error: 'Ta książka jest już w Twoim koszyku' }, { status: 400 });
    }
      
    

    // Add new book to cart
    const updatedCart = await prisma.koszyk.update({
      where: { id: user.koszyk.id },
      data: {
        pozycje: {
          create: {
            ksiazkaId,
          }
        }
      },
      include: {
        pozycje: {
          include: {
            ksiazka: {
              include: {
                zdjecia: true,
                autorzy: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ksiazkaId = searchParams.get('ksiazkaId');

    if (!ksiazkaId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { koszyk: true }
    });

    if (!user?.koszyk) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Delete the cart item
    await prisma.pozycjaKoszyka.delete({
      where: {
        koszykId_ksiazkaId: {
          koszykId: user.koszyk.id,
          ksiazkaId: parseInt(ksiazkaId)
        }
      }
    });

    // Get updated cart
    const updatedCart = await prisma.koszyk.findUnique({
      where: { id: user.koszyk.id },
      include: {
        pozycje: {
          include: {
            ksiazka: {
              include: {
                zdjecia: true,
                autorzy: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 