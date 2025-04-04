import { Inter } from 'next/font/google';
import './globals.css';

import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'e-kwariat - Twój antykwariat online',
    description: 'Odkryj unikalne przedmioty w antykwariacie online e-kwariat.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pl">
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <Navbar />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}