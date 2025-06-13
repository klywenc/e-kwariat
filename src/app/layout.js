// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import ClientSessionProvider from "./components/ClientSessionProvider";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Możesz dodać domyślne metadane tutaj
export const metadata = {
  title: 'E-Kwariat',
  description: 'Twoje miejsce na książki z drugiej ręki i nie tylko.',
};

export default function RootLayout({ children, session }) {
    return (
        <html>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`} // Dodano tło dla spójności
            >
                <ClientSessionProvider session={session}>
                    {/* Główny kontener layoutu flex */}
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </ClientSessionProvider>
            </body>
        </html>
    );
}