// src/app/components/Navbar.js
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon, Cog6ToothIcon, 
  ArchiveBoxIcon, ArrowLeftStartOnRectangleIcon, WrenchScrewdriverIcon, PlusCircleIcon 
} from '@heroicons/react/24/outline';
import { FaCartShopping } from "react-icons/fa6";
import { IoLogInOutline, IoPersonAddOutline } from "react-icons/io5";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const queryFromUrl = searchParams.get('q');
        setSearchTerm(queryFromUrl || '');
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchTerm.trim()) {
            params.set('q', searchTerm.trim());
        }
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

                    <form onSubmit={handleSearch} className="flex items-stretch w-full md:flex-grow md:max-w-xl lg:max-w-2xl xl:max-w-3xl md:mx-auto order-3 md:order-2 mt-3 md:mt-0 border border-gray-300 rounded-lg shadow-sm overflow-hidden h-11 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                        <input type="search" placeholder="Szukaj produktów..." className="flex-grow px-4 text-gray-800 placeholder-gray-400 focus:outline-none h-full rounded-l-md" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 focus:outline-none flex items-center justify-center h-full rounded-r-md" aria-label="Szukaj">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="md:hidden order-2">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
                            {isMenuOpen ? <XMarkIcon className="h-7 w-7"/> : <Bars3Icon className="h-7 w-7"/>}
                        </button>
                    </div>

                    <div className="hidden md:flex items-center space-x-4 order-3 pl-4">
                        <Link href="/" className="text-gray-600 hover:text-indigo-600">Główna</Link>
                        <Link href="/about" className="text-gray-600 hover:text-indigo-600 whitespace-nowrap">O Nas</Link>
                        
                        {session?.user ? (
                            <div className="flex items-center space-x-4">
                                {/* Przycisk "Dodaj Ofertę" widoczny tylko dla admina */}
                                {session.user.role === 'ADMIN' && (
                                    <Link href="/admin/offers" className="bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 whitespace-nowrap flex items-center gap-1">
                                        <PlusCircleIcon className="h-5 w-5" />
                                        Dodaj
                                    </Link>
                                )}

                                <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600 p-2">
                                    <FaCartShopping className="h-6 w-6" />
                                </Link>
                                
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                            {session.user.name || session.user.email}
                                            <UserCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </Menu.Button>
                                    </div>
                                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link href="/profile" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex items-center px-4 py-2 text-sm w-full`}>
                                                            <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                            Mój Profil
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link href="/profile/orders" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex items-center px-4 py-2 text-sm w-full`}>
                                                            <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                            Moje Zamówienia
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link href="/profile/settings" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex items-center px-4 py-2 text-sm w-full`}>
                                                            <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                            Ustawienia
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                {session?.user?.role === 'ADMIN' && (
                                                    <>
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link href="/admin/offers" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex items-center px-4 py-2 text-sm w-full`}>
                                                                    <WrenchScrewdriverIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                                    Zarządzaj Produktami
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link href="/admin/delivery-methods" className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex items-center px-4 py-2 text-sm w-full`}>
                                                                    <WrenchScrewdriverIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                                    Metody Dostawy
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    </>
                                                )}
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={() => signOut()} className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center px-4 py-2 text-sm`}>
                                                            <ArrowLeftStartOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                                            Wyloguj się
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm flex items-center">
                                    <IoLogInOutline className="mr-2 h-5 w-5" />
                                    Zaloguj
                                </Link>
                                <Link href="/register" className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 text-sm flex items-center">
                                    <IoPersonAddOutline className="mr-2 h-5 w-5" />
                                    Zarejestruj
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-3 items-center">
                        <Link href="/" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Strona Główna</Link>
                        <Link href="/about" className="block text-gray-700 hover:text-indigo-600 py-2 whitespace-nowrap" onClick={closeMenu}>O Nas</Link>
                        
                        {session?.user ? (
                            <>
                                <Link href="/profile" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Mój Profil</Link>
                                <Link href="/profile/orders" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Moje Zamówienia</Link>
                                <Link href="/profile/settings" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Ustawienia</Link>
                                {session?.user?.role === 'ADMIN' && (
                                    <>
                                        <Link href="/admin/offers" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Zarządzaj Produktami</Link>
                                        <Link href="/admin/delivery-methods" className="block text-gray-700 hover:text-indigo-600 py-2" onClick={closeMenu}>Metody Dostawy</Link>
                                    </>
                                )}
                                <div className="border-t w-full my-2"></div>
                                <Link href="/cart" className="text-gray-700 hover:text-indigo-600 py-2 flex items-center" onClick={closeMenu}>
                                    <FaCartShopping className="mr-2 h-5 w-5" /> Koszyk
                                </Link>
                                <button onClick={() => { signOut(); closeMenu(); }} className="text-red-600 hover:text-red-800 cursor-pointer flex items-center py-2">
                                    <ArrowLeftStartOnRectangleIcon className="mr-2 h-5 w-5" />Wyloguj się
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-3 w-full max-w-xs items-center pt-2">
                                <Link href="/login" className="block bg-indigo-600 text-white text-center w-full px-4 py-2 rounded-md hover:bg-indigo-700 text-sm flex items-center justify-center" onClick={closeMenu}>
                                    <IoLogInOutline className="mr-2 h-5 w-5" /> Zaloguj się
                                </Link>
                                <Link href="/register" className="block text-indigo-600 border border-indigo-600 text-center w-full px-4 py-2 rounded-md hover:bg-indigo-50 text-sm flex items-center justify-center" onClick={closeMenu}>
                                    <IoPersonAddOutline className="mr-2 h-5 w-5" /> Zarejestruj się
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}