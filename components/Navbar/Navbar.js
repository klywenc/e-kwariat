import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-amber-800 hover:text-amber-700">
                            e-kwariat
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {/* Przyszłe linki nawigacyjne */}
                        </div>
                    </div>

                    <div className="ml-4 flex items-center md:ml-6">
                        <div className="flex items-center space-x-3">
                            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                Zaloguj się
                            </Link>
                            <Link href="/auth/register" className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                                Zarejestruj się
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;