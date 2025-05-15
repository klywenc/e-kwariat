"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.ok) {
            router.push("/");
        } else if (result?.error) {
            if (result.error === "CredentialsSignin") {
                setError("Nieprawidłowy email lub hasło.");
            } else {
                setError(result.error);
            }
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Logowanie
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400"
                            placeholder="jan.kowalski@example.com"
                            required
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

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Nie masz konta?{" "}
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Zarejestruj się
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
