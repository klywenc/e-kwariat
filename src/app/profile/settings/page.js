// src/app/profile/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', nazwisko: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      setFormData({
        name: session.user.name || '',
        nazwisko: session.user.nazwisko || '',
      });
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/settings');
    }
  }, [session, status, router]);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Błąd zapisu');
      // Zaktualizuj sesję, aby zmiany były widoczne od razu (np. w Navbarze)
      await update({ name: data.name, nazwisko: data.nazwisko });
      setMessage('Dane zostały zaktualizowane.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Błąd zmiany hasła');
      setMessage(data.message);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === 'loading') return <div className="text-center p-10">Ładowanie...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Ustawienia konta</h1>
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-6">{message}</p>}
      {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formularz danych osobowych */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dane osobowe</h2>
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Imię</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="nazwisko" className="block text-sm font-medium text-gray-700">Nazwisko</label>
              <input type="text" name="nazwisko" id="nazwisko" value={formData.nazwisko} onChange={(e) => setFormData({...formData, nazwisko: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={session?.user?.email || ''} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Zapisz zmiany</button>
          </form>
        </div>

        {/* Formularz zmiany hasła */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Zmień hasło</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword">Obecne hasło</label>
              <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="newPassword">Nowe hasło</label>
              <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Zmień hasło</button>
          </form>
        </div>
      </div>
    </div>
  );
}