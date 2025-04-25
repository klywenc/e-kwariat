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

export default function RootLayout({ children, session }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ClientSessionProvider session={session}>
                    <Navbar />
                    <main >{children}</main>
                </ClientSessionProvider>
                <Footer />
            </body>
        </html>
    );
}