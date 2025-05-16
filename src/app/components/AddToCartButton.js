// app/components/AddToCartButton.js
'use client'; // Oznaczamy jako Komponent Kliencki

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Lepsze niż window.location

export default function AddToCartButton({ productId, productName, isAvailable, currentStatusName }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleAddToCart = async () => {
        // Nie potrzebujemy e.preventDefault(), bo przycisk nie jest w Linku ani formularzu tutaj
        if (!session) {
            router.push('/login?callbackUrl=' + window.location.pathname); // Przekieruj z callbackUrl
            return;
        }

        setIsAddingToCart(true);
        setMessage({ type: '', content: '' });

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ produktId: productId, ilosc: 1 }),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || 'Nie udało się dodać do koszyka');
            setMessage({ type: 'success', content: responseData.message || `Dodano "${productName}" do koszyka!` });
            setTimeout(() => setMessage({ type: '', content: '' }), 3000);
            // Opcjonalnie: Możesz chcieć zaktualizować globalny stan koszyka lub licznik
        } catch (err) {
            setMessage({ type: 'error', content: err.message });
            console.error("Błąd dodawania do koszyka:", err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="w-full">
            <button
                disabled={!isAvailable || isAddingToCart}
                onClick={handleAddToCart}
                className={`w-full py-3 px-6 rounded-md font-semibold text-white text-base sm:text-lg transition-colors
            ${isAvailable
                        ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300'
                        : 'bg-gray-400 cursor-not-allowed'}`}
            >
                {isAddingToCart ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Dodawanie...
                    </>
                ) : isAvailable ? (
                    'Dodaj do koszyka'
                ) : (
                    currentStatusName || 'Niedostępny'
                )}
            </button>
            {message.content && (
                <p className={`text-xs mt-2 text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {message.content}
                </p>
            )}
        </div>
    );
}