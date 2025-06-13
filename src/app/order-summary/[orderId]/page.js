// src/app/order-summary/[orderId]/page.js
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import Image from 'next/image';

async function getOrderDetails(orderId, userEmail) {
  const id = parseInt(orderId, 10);
  if (isNaN(id)) {
    notFound();
  }

  const order = await prisma.zamowienie.findUnique({
    where: { id: id },
    include: {
      uzytkownik: { // <--- DODAJ TEN INCLUDE
        select: {
          email: true // Pobieramy tylko email, bo tylko tego potrzebujemy do weryfikacji
        }
      },
      adresDostawy: true,
      metodaDostawy: true,
      statusZamowienia: true,
      pozycje: {
        include: {
          produkt: {
            include: {
              zdjecia: { where: { czyGlowne: true }, take: 1 }
            }
          }
        }
      }
    }
  });

  // Sprawdź, czy zamówienie istnieje i czy należy do zalogowanego użytkownika
  if (!order || order.uzytkownik.email !== userEmail) {
    notFound();
  }

  // Serializacja danych (Decimal) przed przekazaniem do komponentu
  const serializedOrder = {
    ...order,
    lacznaWartosc: order.lacznaWartosc.toNumber(),
    kosztDostawy: order.kosztDostawy.toNumber(),
    pozycje: order.pozycje.map(item => ({
      ...item,
      cenaJednostkowa: item.cenaJednostkowa.toNumber(),
      produkt: {
        ...item.produkt,
        cena: item.produkt.cena.toNumber(),
      }
    }))
  };

  return serializedOrder;
}

// Funkcja getUser nie jest już potrzebna w tej formie, bo weryfikujemy w getOrderDetails
// async function getUser(userEmail) { ... }

export default async function OrderSummaryPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/order-summary/${params.orderId}`);
  }

  // Teraz cała logika pobierania i weryfikacji jest w jednej funkcji
  const fullOrderDetails = await getOrderDetails(params.orderId, session.user.email);

  // Sprawdzenie, czy getOrderDetails nie zwróciło błędu (chociaż rzuca notFound())
  if (!fullOrderDetails) {
      notFound();
  }

  const totalValue = fullOrderDetails.lacznaWartosc + fullOrderDetails.kosztDostawy;

  return (
    <main className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-indigo-600">Płatność udana (lub oczekująca)</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Dziękujemy za zamówienie!</h1>
          <p className="mt-2 text-base text-gray-500">
            Potwierdzenie zostało wysłane na adres {session.user.email}. Otrzymasz kolejne powiadomienie, gdy Twoje zamówienie zostanie wysłane.
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Numer zamówienia</dt>
            <dd className="text-indigo-600 mt-2">{fullOrderDetails.numerZamowienia}</dd>
          </dl>
        </div>

        <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
          <h2 id="order-heading" className="sr-only">
            Twoje zamówienie
          </h2>

          <h3 className="sr-only">Produkty</h3>
          {fullOrderDetails.pozycje.map((item) => (
            <div key={item.id} className="py-10 border-b border-gray-200 flex space-x-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <Image
                  src={item.produkt.zdjecia?.[0]?.url || '/images/cover.png'}
                  alt={item.produkt.zdjecia?.[0]?.opisAlt || item.produkt.tytul}
                  fill
                  className="w-full h-full rounded-md object-center object-cover sm:w-full sm:h-full"
                />
              </div>
              <div className="flex-auto flex flex-col">
                <div>
                  <h4 className="font-medium text-gray-900">
                    <Link href={`/product/${item.produkt.id}`}>{item.produkt.tytul}</Link>
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">{item.produkt.opis?.substring(0, 100) || 'Brak opisu'}{item.produkt.opis && item.produkt.opis.length > 100 ? '...' : ''}</p>
                </div>
                <div className="mt-6 flex-1 flex items-end">
                  <dl className="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">Ilość</dt>
                      <dd className="ml-2 text-gray-700">{item.ilosc}</dd>
                    </div>
                    <div className="pl-4 flex sm:pl-6">
                      <dt className="font-medium text-gray-900">Cena</dt>
                      <dd className="ml-2 text-gray-700">{item.cenaJednostkowa.toFixed(2)} zł</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}

          <div className="sm:ml-40 sm:pl-6">
            <dl className="text-sm font-medium text-gray-500 space-y-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <dt>Wartość produktów</dt>
                <dd className="text-gray-900">{fullOrderDetails.lacznaWartosc.toFixed(2)} zł</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dostawa ({fullOrderDetails.metodaDostawy.nazwa})</dt>
                <dd className="text-gray-900">{fullOrderDetails.kosztDostawy.toFixed(2)} zł</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 text-gray-900 pt-6">
                <dt className="text-base">Do zapłaty</dt>
                <dd className="text-base">{totalValue.toFixed(2)} zł</dd>
              </div>
            </dl>

            <dl className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-900">Adres dostawy</dt>
                <dd className="mt-2">
                  <address className="not-italic">
                    <span className="block">{fullOrderDetails.adresDostawy.ulica} {fullOrderDetails.adresDostawy.numerDomu}{fullOrderDetails.adresDostawy.numerMieszkania ? `/${fullOrderDetails.adresDostawy.numerMieszkania}` : ''}</span>
                    <span className="block">{fullOrderDetails.adresDostawy.kodPocztowy} {fullOrderDetails.adresDostawy.miasto}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Informacje o płatności</dt>
                <dd className="mt-2">
                  <p>Status płatności zostanie zaktualizowany.</p>
                  <p>Metoda płatności zostanie wybrana w kolejnym kroku (lub jest już wybrana).</p>
                </dd>
              </div>
            </dl>

            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Kontynuuj zakupy<span aria-hidden="true"> →</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Funkcja generateMetadata (pozostaje bez zmian)
export async function generateMetadata({ params }) {
    const orderId = parseInt(params.orderId, 10);
    if (isNaN(orderId)) return { title: 'Błąd zamówienia' };

    return {
        title: `Podsumowanie zamówienia #${orderId} - E-Kwariat`,
        description: `Dziękujemy za złożenie zamówienia. Zobacz podsumowanie swojego zamówienia o numerze ${orderId}.`,
    };
}