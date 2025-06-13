// src/app/checkout/CheckoutForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutForm({ cart, userAddresses, deliveryMethods }) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(userAddresses.find(a => a.czyDomyslny)?.id || userAddresses[0]?.id || '');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(deliveryMethods[0]?.id || '');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const selectedDeliveryMethod = deliveryMethods.find(d => d.id === parseInt(selectedDeliveryId));
  const deliveryCost = selectedDeliveryMethod ? Number(selectedDeliveryMethod.koszt) : 0;

  const productsValue = cart.pozycje.reduce((sum, item) => {
    const itemPrice = item.produkt?.cena ? Number(item.produkt.cena) : 0;
    return sum + (item.ilosc * itemPrice);
  }, 0);

  const totalValue = productsValue + deliveryCost;

  const handleSubmitOrder = async () => {
    if (!selectedAddressId || !selectedDeliveryId) {
      setError('Proszę wybrać adres i metodę dostawy.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adresDostawyId: parseInt(selectedAddressId),
          metodaDostawyId: parseInt(selectedDeliveryId),
          uwagiKlienta: customerNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się złożyć zamówienia.');
      }

      // Przekieruj na stronę podsumowania zamówienia
      router.push(`/order-summary/${data.orderId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
      <section className="lg:col-span-7 xl:col-span-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Dane do wysyłki</h2>
        
        {/* Wybór adresu */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Wybierz adres dostawy</h3>
          <div className="space-y-4">
            {userAddresses.map(address => (
              <label key={address.id} className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={(e) => setSelectedAddressId(parseInt(e.target.value))}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium text-gray-800">{address.ulica} {address.numerDomu}{address.numerMieszkania ? `/${address.numerMieszkania}` : ''}</p>
                  <p className="text-gray-600">{address.kodPocztowy} {address.miasto}</p>
                </div>
              </label>
            ))}
          </div>
          {userAddresses.length === 0 && <p className="text-sm text-gray-500">Nie masz jeszcze żadnych adresów. <Link href="/profile/addresses" className="text-indigo-600 hover:underline">Dodaj adres w profilu</Link>.</p>}
        </div>

        {/* Wybór metody dostawy */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Wybierz metodę dostawy</h3>
          <div className="space-y-4">
            {deliveryMethods.map(method => (
              <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                <input
                  type="radio"
                  name="delivery"
                  value={method.id}
                  checked={selectedDeliveryId === method.id}
                  onChange={(e) => setSelectedDeliveryId(parseInt(e.target.value))}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <div className="ml-4 flex justify-between w-full text-sm">
                  <p className="font-medium text-gray-800">{method.nazwa}</p>
                  <p className="text-gray-600">{Number(method.koszt).toFixed(2)} zł</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Uwagi do zamówienia */}
        <div>
          <label htmlFor="notes" className="text-lg font-medium text-gray-900 mb-2 block">Uwagi do zamówienia (opcjonalnie)</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tutaj możesz wpisać dodatkowe informacje dla sprzedającego..."
          />
        </div>
      </section>

      {/* Podsumowanie zamówienia */}
      <section aria-labelledby="summary-heading" className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
          <h2 id="summary-heading" className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">
            Podsumowanie
          </h2>
          <dl className="space-y-4">
            {cart.pozycje.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <dt className="text-gray-600 line-clamp-1 pr-2">{item.produkt.tytul} <span className="font-mono">x{item.ilosc}</span></dt>
                <dd className="font-medium text-gray-900 whitespace-nowrap">{(Number(item.produkt.cena) * item.ilosc).toFixed(2)} zł</dd>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-sm text-gray-600">Wartość produktów</dt>
              <dd className="text-sm font-medium text-gray-900">{productsValue.toFixed(2)} zł</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Dostawa</dt>
              <dd className="text-sm font-medium text-gray-900">{deliveryCost.toFixed(2)} zł</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">Do zapłaty</dt>
              <dd className="text-base font-medium text-gray-900">{totalValue.toFixed(2)} zł</dd>
            </div>
          </dl>
          <div className="mt-6">
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <button
              onClick={handleSubmitOrder}
              disabled={isProcessing || !selectedAddressId || !selectedDeliveryId}
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Przetwarzanie...' : 'Zamawiam i płacę'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}