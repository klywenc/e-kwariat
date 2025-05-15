// src/app/cart/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Do przekierowania

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState(null); // cart będzie teraz obiektem { id, uzytkownikId, pozycje: [] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null); // Do śledzenia, która pozycja jest aktualizowana

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Nie udało się pobrać koszyka');
      }
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
      setCart(null); // W przypadku błędu, czyścimy koszyk
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setCart(null); // Upewnij się, że koszyk jest czysty dla niezalogowanego
    }
    // Celowo nie dodajemy fetchCart do dependency array, aby uniknąć pętli przy błędach
  }, [status]);

  const handleRemoveFromCart = async (produktId) => {
    setError(null);
    try {
      const response = await fetch(`/api/cart?produktId=${produktId}`, { // ZMIANA: ksiazkaId na produktId
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się usunąć produktu z koszyka');
      }
      setCart(data.koszyk); // API zwraca { message, koszyk }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateQuantity = async (produktId, nowaIlosc) => {
    if (nowaIlosc <= 0) { // Jeśli nowa ilość to 0 lub mniej, usuń produkt
      handleRemoveFromCart(produktId);
      return;
    }
    setUpdatingItemId(produktId); // Ustawiamy ID aktualizowanej pozycji
    setError(null);
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produktId, ilosc: nowaIlosc }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się zaktualizować ilości');
      }
      setCart(data.koszyk);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItemId(null); // Resetujemy ID po zakończeniu
    }
  };


  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-700">Ładowanie koszyka...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Twój Koszyk</h1>
        <p className="mb-6 text-gray-600">Musisz być zalogowany, aby zobaczyć i edytować swój koszyk.</p>
        <button
          onClick={() => router.push('/login?callbackUrl=/cart')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Zaloguj się
        </button>
      </div>
    );
  }

  if (error && !cart) { // Pokaż błąd tylko jeśli nie udało się załadować koszyka
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Twój Koszyk</h1>
          <p className="text-red-600 bg-red-100 p-3 rounded-md">Wystąpił błąd: {error}</p>
          <button onClick={fetchCart} className="mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
            Spróbuj ponownie
          </button>
        </div>
    );
  }

  const totalValue = cart?.pozycje?.reduce((sum, item) => {
    // Upewnij się, że item.produkt i item.produkt.cena istnieją
    const itemPrice = item.produkt?.cena ? Number(item.produkt.cena) : 0;
    return sum + (item.ilosc * itemPrice);
  }, 0) || 0;

  const totalItems = cart?.pozycje?.reduce((sum, item) => sum + item.ilosc, 0) || 0;

  return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Twój koszyk</h1>
          {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">Błąd: {error}</p>}

          {!cart || !cart.pozycje || cart.pozycje.length === 0 ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="mt-2 text-xl font-medium text-gray-900">Twój koszyk jest pusty</h2>
              <p className="mt-1 text-sm text-gray-500">Dodaj coś do koszyka, aby kontynuować.</p>
              <div className="mt-6">
                <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                  Przeglądaj produkty <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
              <section className="lg:col-span-7 xl:col-span-8">
                <h2 className="sr-only">Produkty w Twoim koszyku</h2>
                <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                  {cart.pozycje.map((item) => (
                    item.produkt ? ( // Dodatkowe sprawdzenie, czy produkt istnieje
                    <li key={item.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.produkt.zdjecia?.[0]?.url || '/images/cover.png'}
                          alt={item.produkt.zdjecia?.[0]?.opisAlt || item.produkt.tytul}
                          width={96} // md:w-32 -> w-24
                          height={128} // md:h-48 -> h-32
                          className="w-24 h-32 sm:w-32 sm:h-40 rounded-md object-cover object-center border border-gray-200"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <Link href={`/product/${item.produkt.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                  {item.produkt.tytul}
                                </Link>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              <p className="text-gray-500">{item.produkt.typProduktu?.nazwa || 'Produkt'}</p>
                              {/* Można dodać więcej info, np. autor dla książki */}
                              {item.produkt.typProduktu?.nazwa === 'Książka' && item.produkt.daneKsiazki?.autorzy?.length > 0 && (
                                <>
                                  <span className="mx-2 text-gray-400" aria-hidden="true">|</span>
                                  <p className="text-gray-500 line-clamp-1">{item.produkt.daneKsiazki.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ')}</p>
                                </>
                              )}
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">{Number(item.produkt.cena).toFixed(2)} zł</p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <label htmlFor={`quantity-${item.produkt.id}`} className="sr-only">
                              Ilość, {item.produkt.tytul}
                            </label>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleUpdateQuantity(item.produkt.id, item.ilosc - 1)}
                                    disabled={updatingItemId === item.produkt.id || item.ilosc <= 1}
                                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                                >-</button>
                                <input
                                    id={`quantity-${item.produkt.id}`}
                                    name={`quantity-${item.produkt.id}`}
                                    type="number"
                                    min="1"
                                    value={item.ilosc}
                                    onChange={(e) => {
                                        const newQuantity = parseInt(e.target.value, 10);
                                        if (!isNaN(newQuantity) && newQuantity >= 1) {
                                            handleUpdateQuantity(item.produkt.id, newQuantity);
                                        }
                                    }}
                                    onBlur={(e) => { // Jeśli użytkownik wpisze 0 lub mniej i opuści pole, usuń
                                        const newQuantity = parseInt(e.target.value, 10);
                                        if (isNaN(newQuantity) || newQuantity < 1) {
                                            handleRemoveFromCart(item.produkt.id);
                                        }
                                    }}
                                    className="w-12 text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mx-2"
                                    disabled={updatingItemId === item.produkt.id}
                                />
                                <button
                                    onClick={() => handleUpdateQuantity(item.produkt.id, item.ilosc + 1)}
                                    disabled={updatingItemId === item.produkt.id}
                                    className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
                                >+</button>
                            </div>


                            <div className="absolute top-0 right-0">
                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(item.produkt.id)}
                                className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                disabled={updatingItemId === item.produkt.id}
                              >
                                <span className="sr-only">Usuń</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        {updatingItemId === item.produkt.id && <p className="text-xs text-indigo-600 mt-2">Aktualizowanie...</p>}
                      </div>
                    </li>
                    ) : null // Jeśli item.produkt nie istnieje, nie renderuj tej pozycji
                  ))}
                </ul>
              </section>

              {/* Podsumowanie zamówienia */}
              <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                  Podsumowanie koszyka
                </h2>

                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Liczba pozycji</dt>
                    <dd className="text-sm font-medium text-gray-900">{totalItems}</dd>
                  </div>
                  {/* Można dodać koszt wysyłki, jeśli jest już znany */}
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">Łączna wartość</dt>
                    <dd className="text-base font-medium text-gray-900">{totalValue.toFixed(2)} zł</dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    type="submit" // Jeśli to jest formularz, lub onClick dla nawigacji
                    onClick={() => router.push('/checkout')} // Przykładowe przekierowanie do kasy
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    Przejdź do kasy
                  </button>
                </div>
                <div className="mt-6 text-center text-sm">
                    <p>
                        lub{' '}
                        <Link href="/" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Kontynuuj zakupy<span aria-hidden="true"> →</span>
                        </Link>
                    </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
  );
}