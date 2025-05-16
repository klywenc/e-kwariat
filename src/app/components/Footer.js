import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} E-Kwariat. Wszelkie prawa zastrzeżone.</p>
          {/* Możesz dodać linki do polityki prywatności, regulaminu itp. */}
          <div className="mt-2 space-x-4">
              <Link href="/privacy-policy" className="hover:text-white text-sm">
                  Polityka Prywatności
              </Link>
              <Link href="/terms-of-service" className="hover:text-white text-sm">
                  Regulamin
              </Link>
          </div>
        </div>
      </footer>
    );
  }