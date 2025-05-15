"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Do przekierowania po udanej rejestracji

export default function RegisterPage() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Stan ładowania dla przycisku
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Rejestracja udana! Za chwilę zostaniesz przekierowany do logowania.");
                // Opcjonalne: wyczyść formularz
                e.target.reset();
                // Przekieruj do strony logowania po krótkim opóźnieniu
                setTimeout(() => {
                    router.push("/login");
                }, 2000); // 2 sekundy opóźnienia
            } else {
                setError(data.message || "Rejestracja nie powiodła się. Spróbuj ponownie.");
            }
        } catch (err) {
            setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
            console.error("Registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
                {/* ZMIANA: Dodano kolor tekstu i większy margines dolny */}
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Rejestracja
                </h2>

                {/* Wyświetlanie komunikatu o błędzie */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Wyświetlanie komunikatu o sukcesie */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Imię
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="Jan"
                            required
                            disabled={isLoading} // Wyłącz input podczas ładowania
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="jan.kowalski@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Hasło
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="••••••••"
                            required
                            minLength={6} // Dodaj walidację minimalnej długości hasła
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading} // Wyłącz przycisk podczas ładowania
                        className={`w-full flex justify-center items-center bg-green-600 text-white py-2.5 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold transition-colors ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Zarejestruj się"
                        )}
                    </button>
                </form>
                {/* Opcjonalnie: Link do logowania */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Masz już konto?{' '}
                        <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                            Zaloguj się
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}