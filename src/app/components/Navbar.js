"use client";

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                    E-Kwariat
                </Link>

                {/* Desktop Navigation - widoczne na większych ekranach */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="flex space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-indigo-600">
                            Strona Główna
                        </Link>
                        <Link href="/kategorie" className="text-gray-600 hover:text-indigo-600">
                            Kategorie
                        </Link>
                        <Link href="/kontakt" className="text-gray-600 hover:text-indigo-600">
                            Kontakt
                        </Link>

                        {session?.user?.role === 'ADMIN' && (
                            <Link
                                href="/offers"
                                className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
                            >
                                Zarządzaj Ofertami
                            </Link>
                        )}
                    </div>

                    {session?.user ? (
                        <div className="flex items-center space-x-4 ml-4">
                            <span className="text-gray-600">Witaj, {session.user.name}</span>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                            >
                                Wyloguj się
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-2 ml-4">
                            <Link
                                href="/login"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                            >
                                Zaloguj się
                            </Link>
                            <Link
                                href="/register"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                            >
                                Zarejestruj się
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button - widoczny tylko na małych ekranach */}
                <div className="md:hidden bg-white pb-4 px-4 text-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-600 hover:text-indigo-600 focus:outline-none"
                    >
                        {isMenuOpen ? (
                            <XMarkIcon className="h-6 w-6"/>
                        ) : (
                            <Bars3Icon className="h-6 w-6"/>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation - wysuwane menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white pb-4 px-4 text-center">
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/"
                            className="block text-gray-600 hover:text-indigo-600 py-2 mx-auto"
                            onClick={toggleMenu}
                        >
                            Strona Główna
                        </Link>
                        <Link
                            href="/kategorie"
                            className="block text-gray-600 hover:text-indigo-600 py-2 mx-auto"
                            onClick={toggleMenu}
                        >
                            Kategorie
                        </Link>
                        <Link
                            href="/kontakt"
                            className="block text-gray-600 hover:text-indigo-600 py-2 mx-auto"
                            onClick={toggleMenu}
                        >
                            Kontakt
                        </Link>

                        {session?.user?.role === 'ADMIN' && (
                            <Link
                                href="/offers"
                                className="block bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700 mx-auto w-48"
                                onClick={toggleMenu}
                            >
                                Zarządzaj Ofertami
                            </Link>
                        )}

                        {session?.user ? (
                            <>
                                <div className="text-gray-600 py-2">
                                    Witaj, {session.user.name}
                                </div>
                                <button
                                    onClick={() => {
                                        signOut();
                                        toggleMenu();
                                    }}
                                    className="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm mx-auto w-48"
                                >
                                    Wyloguj się
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 pt-2 items-center">
                                <Link
                                    href="/login"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm w-48"
                                    onClick={toggleMenu}
                                >
                                    Zaloguj się
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm w-48"
                                    onClick={toggleMenu}
                                >
                                    Zarejestruj się
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}