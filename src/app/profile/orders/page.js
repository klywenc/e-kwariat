// src/app/profile/orders/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/profile/orders');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Nie udało się pobrać historii zamówień');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/orders');
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="text-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Ładowanie historii zamówień...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-600 bg-red-100 p-3 rounded-md">Wystąpił błąd: {error}</p>
        <button onClick={fetchOrders} className="mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Moje zamówienia</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <h2 className="text-xl font-medium text-gray-900">Brak historii zamówień</h2>
          <p className="mt-1 text-sm text-gray-500">Nie złożyłeś jeszcze żadnego zamówienia.</p>
          <div className="mt-6">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              Rozpocznij zakupy <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numer zamówienia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data złożenia</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liczba produktów</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Wartość całkowita</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Zobacz</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const totalValue = order.lacznaWartosc + order.kosztDostawy;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.numerZamowienia}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.dataZlozenia).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.statusZamowienia?.nazwa === 'Nowe' ? 'bg-blue-100 text-blue-800' :
                          order.statusZamowienia?.nazwa === 'Wysłane' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.statusZamowienia?.nazwa || 'Brak statusu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{order.pozycje.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">{totalValue.toFixed(2)} zł</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/order-summary/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Szczegóły
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}