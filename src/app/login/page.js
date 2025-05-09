"use client";

import { signIn } from "next-auth/react";
import { useState } from "react"; // Import useState do obsługi błędów

export default function LoginPage() {
    const [error, setError] = useState(null); // Stan do przechowywania błędów logowania

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Resetuj błąd przed próbą logowania
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = await signIn("credentials", {
            redirect: false, // Aby obsłużyć błąd ręcznie
            email,
            password,
        });

        if (result?.error) {
            // Ustaw komunikat błędu na podstawie odpowiedzi z NextAuth
            if (result.error === "CredentialsSignin") {
                setError("Nieprawidłowy email lub hasło.");
            } else {
                setError(result.error);
            }
        } else if (result?.ok && !result?.error) {
            // Logowanie udane, NextAuth domyślnie przekieruje,
            // lub możesz dodać własną logikę przekierowania tutaj, jeśli `redirect: false`
            // np. router.push('/dashboard');
            // Jeśli nie ma przekierowania, możesz chcieć wyczyścić formularz lub pokazać komunikat sukcesu
        }
    };

    return (
        // Główny kontener strony, tło już jest ustawione globalnie lub tutaj na bg-gray-100
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
                {/* ZMIANA: Dodano kolor tekstu i większy margines dolny */}
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Logowanie
                </h2>

                {/* Wyświetlanie komunikatu o błędzie */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6"> {/* Zwiększono space-y */}
                    <div>
                        {/* Etykieta już ma text-gray-700, co jest OK */}
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email" // Dodano id dla powiązania z label
                            type="email"
                            name="email"
                            // ZMIANA: Dodano ciemniejszy kolor placeholdera i tekstu inputa
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="jan.kowalski@example.com"
                            required
                        />
                    </div>
                    <div>
                        {/* Etykieta już ma text-gray-700, co jest OK */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Hasło
                        </label>
                        <input
                            id="password" // Dodano id dla powiązania z label
                            type="password"
                            name="password"
                            // ZMIANA: Dodano ciemniejszy kolor placeholdera i tekstu inputa
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-semibold transition-colors"
                    >
                        Zaloguj się
                    </button>
                </form>
                {/* Opcjonalnie: Link do rejestracji lub odzyskiwania hasła */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Nie masz konta?{' '}
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Zarejestruj się
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}