"use client";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
            <div className="text-lg font-bold">E-Kwariat</div>
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <>
                        <span>Witaj, {session.user.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Wyloguj się
                        </button>
                    </>
                ) : (
                    <span>Nie zalogowano</span>
                )}
            </div>
        </div>
    );
}