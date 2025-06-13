// app/components/ReservationToggleButton.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReservationToggleButton({ productId, initialIsReserved }) {
    const [isReserved, setIsReserved] = useState(initialIsReserved);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleToggleReservation = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produktId: productId, czyZarezerwowany: !isReserved }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Nie udało się zaktualizować rezerwacji.');
            }

            // Pomyślnie zaktualizowano, zmień stan lokalny
            setIsReserved(!isReserved);

            // Odśwież dane na stronie, aby zobaczyć zmiany (np. status "Zarezerwowany")
            router.refresh();

        } catch (err) {
            console.error("Błąd podczas zmiany statusu rezerwacji:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleToggleReservation}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md transition duration-200 text-base font-bold flex items-center justify-center ${
                    isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isReserved
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
                {isLoading
                    ? 'Przetwarzanie...'
                    : isReserved
                        ? 'Anuluj rezerwację'
                        : 'Zarezerwuj'
                }
            </button>
            {error && <p className="text-xs mt-2 text-center text-red-600">{error}</p>}
        </div>
    );
}