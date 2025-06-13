// src/app/checkout/page.js
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CheckoutForm from './CheckoutForm'; // Importujemy komponent kliencki

async function getCheckoutData(userEmail) {
  // Pobieramy wszystko w jednej transakcji lub równolegle
  const [userWithCart, deliveryMethods] = await Promise.all([
    prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        adresy: { orderBy: { czyDomyslny: 'desc' } }, // Domyślny adres jako pierwszy
        koszyk: {
          include: {
            pozycje: {
              orderBy: { id: 'asc' },
              include: {
                produkt: {
                  select: { id: true, tytul: true, cena: true, zdjecia: { where: { czyGlowne: true }, take: 1 } }
                }
              }
            }
          }
        }
      }
    }),
    prisma.metodaDostawy.findMany({
      where: { czyAktywna: true },
      orderBy: { koszt: 'asc' }
    })
  ]);

  if (!userWithCart) {
    // To nie powinno się zdarzyć, jeśli sesja istnieje, ale dla bezpieczeństwa
    redirect('/login');
  }

  // Serializacja Decimal w metodach dostawy
  const serializedDeliveryMethods = deliveryMethods.map(method => ({
    ...method,
    koszt: method.koszt.toNumber(),
  }));

  return {
    cart: userWithCart.koszyk,
    userAddresses: userWithCart.adresy,
    deliveryMethods: serializedDeliveryMethods,
  };
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/checkout');
  }

  const { cart, userAddresses, deliveryMethods } = await getCheckoutData(session.user.email);

  if (!cart || cart.pozycje.length === 0) {
    // Jeśli koszyk jest pusty, przekieruj na stronę koszyka, która pokaże komunikat
    redirect('/cart');
  }

  // Serializacja danych koszyka przed przekazaniem do komponentu klienckiego
  const serializedCart = {
    ...cart,
    pozycje: cart.pozycje.map(item => ({
      ...item,
      produkt: {
        ...item.produkt,
        cena: item.produkt.cena.toNumber(),
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Kasa</h1>
        <CheckoutForm
          cart={serializedCart}
          userAddresses={userAddresses}
          deliveryMethods={deliveryMethods}
        />
      </div>
    </div>
  );
}