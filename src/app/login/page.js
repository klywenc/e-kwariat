"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Logowanie</h2>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const email = e.target.email.value;
                        const password = e.target.password.value;

                        const res = await signIn("credentials", {
                            redirect: false,
                            email,
                            password,
                        });

                        if (res?.ok) {
                            router.push("/");
                        } else {
                            alert("Nieprawidłowy email lub hasło.");
                        }
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Wprowadź email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hasło</label>
                        <input
                            type="password"
                            name="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Wprowadź hasło"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                    >
                        Zaloguj się
                    </button>
                </form>
            </div>
        </main>
    );
}
