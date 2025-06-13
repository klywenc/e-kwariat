// src/app/profile/page.js
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/profile');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Witaj, {session.user.name || session.user.email}!</h1>
      <p className="text-gray-600 mb-8">Zarządzaj swoim kontem, adresami i zamówieniami.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Karta do zarządzania adresami */}
        <Link href="/profile/addresses" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Moje adresy</h2>
          <p className="mt-2 text-sm text-gray-600">Zarządzaj swoimi adresami dostawy i ustaw adres domyślny.</p>
        </Link>

        {/* Karta do historii zamówień (do zrobienia w przyszłości) */}
        <Link href="/profile/orders" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Historia zamówień</h2>
          <p className="mt-2 text-sm text-gray-600">Przeglądaj swoje poprzednie i bieżące zamówienia.</p>
        </Link>

        {/* Karta do zmiany danych konta (do zrobienia w przyszłości) */}
        <Link href="/profile/settings" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Ustawienia konta</h2>
          <p className="mt-2 text-sm text-gray-600">Zmień swoje dane osobowe lub hasło.</p>
        </Link>
      </div>
    </div>
  );
}