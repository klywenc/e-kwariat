// src/app/components/Navbar.js
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    // const [selectedCategory, setSelectedCategory] = useState(''); // USUNIĘTE
    // const categories = [ ... ]; // USUNIĘTE

    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        // const categoryFromUrl = searchParams.get('category'); // USUNIĘTE
        setSearchTerm(queryFromUrl || '');
        // setSelectedCategory(categoryFromUrl || ''); // USUNIĘTE
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        }
        // if (selectedCategory) params.set('category', selectedCategory); // USUNIĘTE
        router.push(`/search?${params.toString()}`);
        if (isMenuOpen) setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-3">
                    <Link href="/" className="text-2xl font-bold text-indigo-600 order-1">
                        E-Kwariat
                    </Link>

                    {/* ZMODYFIKOWANY Formularz wyszukiwarki (bez kategorii) */}
                    <form
                        onSubmit={handleSearch}
                        className={`
                            flex items-stretch w-full md:flex-grow md:max-w-xl lg:max-w-2xl xl:max-w-3xl
                            md:mx-auto order-3 md:order-2 mt-3 md:mt-0
                            border border-gray-300 rounded-lg shadow-sm overflow-hidden h-11 bg-white
                            focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500
                        `}
                    >
                        <input
                            type="search"
                            placeholder="Szukaj książek po tytule, autorze..." // Zmieniony placeholder
                            className="flex-grow px-4 text-gray-800 placeholder-gray-400 focus:outline-none h-full rounded-l-md" // rounded-l-md, bo przycisk będzie po prawej
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Kontener dla selecta USUNIĘTY */}
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 focus:outline-none flex items-center justify-center h-full rounded-r-md" // rounded-r-md
                            aria-label="Szukaj"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="md:hidden order-2">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
                            {isMenuOpen ? <XMarkIcon className="h-7 w-7"/> : <Bars3Icon className="h-7 w-7"/>}
                        </button>
                    </div>

                    {/* Linki nawigacyjne i sekcja użytkownika - bez zmian */}
                    <div className="hidden md:flex items-center space-x-4 order-3">
                        <Link href="/" className="text-gray-600 hover:text-indigo-600">Główna</Link>
                        <Link href="/kategorie" className="text-gray-600 hover:text-indigo-600">Kategorie</Link>
                        {session?.user?.role === 'ADMIN' && (
                            <Link href="/admin/offers" className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-600 whitespace-nowrap">Zarządzaj</Link>
                        )}
                        {session?.user && session?.user?.role !== 'ADMIN' && (
                             <Link href="/offers/new" className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 whitespace-nowrap">Dodaj Ofertę</Link>
                        )}
                        {session?.user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 text-sm">
                                    Witaj, <Link href="/profil" className="font-medium hover:text-indigo-600">{session.user.name || session.user.email}</Link>
                                </span>
                                <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm">Wyloguj</button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">Zaloguj</Link>
                                <Link href="/register" className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 text-sm">Zarejestruj</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu mobilne - bez zmian */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-3 items-center">
                        <Link href="/" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Strona Główna</Link>
                        <Link href="/kategorie" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Kategorie</Link>
                        {session?.user?.role === 'ADMIN' && (
                            <Link href="/admin/offers" className="block bg-indigo-500 text-white w-full max-w-xs text-center px-3 py-2 rounded-md text-sm hover:bg-indigo-600" onClick={closeMenu}>Zarządzaj Ofertami</Link>
                        )}
                        {session?.user && session?.user?.role !== 'ADMIN' && (
                             <Link href="/offers/new" className="block bg-green-500 text-white w-full max-w-xs text-center px-3 py-2 rounded-md text-sm hover:bg-green-600" onClick={closeMenu}>Dodaj Ofertę</Link>
                        )}
                        {session?.user ? (
                            <>
                                <div className="text-gray-700 py-2 text-sm">
                                    Witaj, <Link href="/profil" className="font-medium hover:text-indigo-600" onClick={closeMenu}>{session.user.name || session.user.email}</Link>
                                </div>
                                <button onClick={() => { signOut(); closeMenu(); }} className="block bg-red-500 text-white w-full max-w-xs text-center px-4 py-2 rounded-md hover:bg-red-600 text-sm">Wyloguj się</button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-3 w-full max-w-xs items-center pt-2">
                                <Link href="/login" className="block bg-indigo-600 text-white text-center w-full px-4 py-2 rounded-md hover:bg-indigo-700 text-sm" onClick={closeMenu}>Zaloguj się</Link>
                                <Link href="/register" className="block text-indigo-600 border border-indigo-600 text-center w-full px-4 py-2 rounded-md hover:bg-indigo-50 text-sm" onClick={closeMenu}>Zarejestruj się</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}