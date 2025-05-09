'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (ksiazkaId) => {
    try {
      const response = await fetch(`/api/cart?ksiazkaId=${ksiazkaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Koszyk</h1> {/* <--- DODANO text-gray-800 */}
        <p className="mb-4 text-gray-600">Musisz być zalogowany, aby zobaczyć swój
          koszyk.</p> {/* <--- DODANO text-gray-600 */}
        <Link href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"> {/* <--- ZMIENIONO KOLOR LINKU na bardziej widoczny */}
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Koszyk</h1>
          <p className="text-red-600">Wystąpił błąd: {error}</p>
        </div>
    );
  }

  const totalValue = cart?.pozycje?.reduce((sum, item) => {
    return sum + (Number(item.ksiazka.cena));
  }, 0) || 0;

  return (
      <div className="min-h-screen p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Twój koszyk</h1>

        {!cart?.pozycje?.length ? (
        <div className="text-center py-8">
          <p className="text-xl mb-4">Twój koszyk jest pusty</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Przejdź do ofert
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.pozycje.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border-b">
                <div className="relative w-full md:w-32 h-48">
                  <Image
                    src={item.ksiazka.zdjecia[0]?.url || '/placeholder-book.jpg'}
                    alt={item.ksiazka.zdjecia[0]?.opisAlt || item.ksiazka.tytul}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{item.ksiazka.tytul}</h2>
                  <p className="text-gray-600 mb-2">
                    Autor: {item.ksiazka.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`).join(', ')}
                  </p>
                  
                  <p className="text-lg font-semibold mb-4">
                    Cena: {Number(item.ksiazka.cena).toFixed(2)} zł
                  </p>
                  <button
                    onClick={() => removeFromCart(item.ksiazka.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Usuń z koszyka
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Podsumowanie</h2>
              <div className="space-y-2 mb-4">
                <p className="flex justify-between">
                  <span>Liczba produktów:</span>
                  <span>{cart.pozycje.length}</span>
                </p>
                <p className="flex justify-between font-bold text-lg">
                  <span>Łączna wartość:</span>
                  <span>{totalValue.toFixed(2)} zł</span>
                </p>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {/* TODO: Implement checkout */}}
              >
                Przejdź do kasy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 