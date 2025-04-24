import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          E-Kwariat
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-indigo-600">
            Strona Główna
          </Link>
          {/* Dodaj więcej linków nawigacyjnych wg potrzeb */}
          <Link href="/kategorie" className="text-gray-600 hover:text-indigo-600">
            Kategorie
          </Link>
          <Link href="/kontakt" className="text-gray-600 hover:text-indigo-600">
            Kontakt
          </Link>
          {/* Link do zarządzania - może być widoczny tylko dla admina */}
          <Link
            href="/offers"
            className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
          >
            Zarządzaj Ofertami
          </Link>
          {/* TODO: Dodać logowanie/rejestrację/profil użytkownika */}
        </div>
      </nav>
    </header>
  );
}