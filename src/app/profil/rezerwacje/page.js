// src/app/profil/rezerwacje/page.js

'use client'; // <--- DODAJ TĘ LINIĘ NA SAMEJ GÓRZE

import { useState, useEffect } from 'react';

export default function ReservationsPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            // Zakładając, że API zwraca wszystkie produkty, możesz chcieć filtrować
            // lub mieć dedykowany endpoint dla produktów, które można rezerwować.
            const res = await fetch('/api/offers');
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();
    }, []);

    async function toggleReservation(productId, currentStatus) {
        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produktId: productId, czyZarezerwowany: !currentStatus }),
            });

            if (!res.ok) {
                // Obsługa błędu, jeśli API zwróci błąd
                const errorData = await res.json();
                throw new Error(errorData.error || 'Nie udało się zaktualizować rezerwacji.');
            }

            // Aktualizacja stanu lokalnego po pomyślnej odpowiedzi z API
            setProducts(products.map(p =>
                p.id === productId ? { ...p, czyZarezerwowany: !currentStatus } : p
            ));

        } catch (error) {
            console.error("Błąd podczas zmiany statusu rezerwacji:", error);
            // Możesz tutaj ustawić stan, aby wyświetlić błąd użytkownikowi
        }
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Zarządzaj rezerwacjami</h1>
            {products.length > 0 ? (
                <ul className="space-y-4">
                    {products.map(product => (
                        <li key={product.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                            <div>
                                <p className="font-semibold">{product.tytul}</p>
                                <p className={`text-sm ${product.czyZarezerwowany ? 'text-red-500' : 'text-green-600'}`}>
                                    Status: {product.czyZarezerwowany ? 'Zarezerwowane' : 'Dostępne'}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleReservation(product.id, product.czyZarezerwowany)}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                                    product.czyZarezerwowany
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {product.czyZarezerwowany ? 'Oznacz jako dostępne' : 'Zarezerwuj'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ładowanie produktów...</p>
            )}
        </div>
    );
}