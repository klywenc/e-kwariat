// src/app/profile/addresses/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const initialFormData = { ulica: '', numerDomu: '', numerMieszkania: '', kodPocztowy: '', miasto: '', czyDomyslny: false };

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) throw new Error('Nie udało się pobrać adresów');
      const data = await response.json();
      setAddresses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses();
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile/addresses');
    }
  }, [status, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      ulica: address.ulica,
      numerDomu: address.numerDomu,
      numerMieszkania: address.numerMieszkania || '',
      kodPocztowy: address.kodPocztowy,
      miasto: address.miasto,
      czyDomyslny: address.czyDomyslny,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć ten adres?')) return;
    try {
      const response = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Błąd usuwania'); }
      fetchAddresses(); // Odśwież listę
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
      const method = editingAddress ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Błąd zapisu'); }
      setEditingAddress(null);
      setFormData(initialFormData);
      fetchAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="text-center p-10">Ładowanie...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Moje adresy</h1>

      {/* Formularz dodawania/edycji */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">{editingAddress ? 'Edytuj adres' : 'Dodaj nowy adres'}</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ulica" className="block text-sm font-medium text-gray-700">Ulica</label>
              <input type="text" name="ulica" id="ulica" value={formData.ulica} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="numerDomu" className="block text-sm font-medium text-gray-700">Nr domu</label>
                <input type="text" name="numerDomu" id="numerDomu" value={formData.numerDomu} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="numerMieszkania" className="block text-sm font-medium text-gray-700">Nr lokalu</label>
                <input type="text" name="numerMieszkania" id="numerMieszkania" value={formData.numerMieszkania} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="kodPocztowy" className="block text-sm font-medium text-gray-700">Kod pocztowy</label>
              <input type="text" name="kodPocztowy" id="kodPocztowy" value={formData.kodPocztowy} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="miasto" className="block text-sm font-medium text-gray-700">Miasto</label>
              <input type="text" name="miasto" id="miasto" value={formData.miasto} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input id="czyDomyslny" name="czyDomyslny" type="checkbox" checked={formData.czyDomyslny} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="czyDomyslny" className="font-medium text-gray-700">Ustaw jako adres domyślny</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {editingAddress && <button type="button" onClick={() => { setEditingAddress(null); setFormData(initialFormData); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Anuluj</button>}
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{isSubmitting ? 'Zapisywanie...' : (editingAddress ? 'Zapisz zmiany' : 'Dodaj adres')}</button>
          </div>
        </form>
      </div>

      {/* Lista adresów */}
      <div className="space-y-4">
        {addresses.map(address => (
          <div key={address.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">{address.ulica} {address.numerDomu}{address.numerMieszkania ? `/${address.numerMieszkania}` : ''}</p>
              <p className="text-sm text-gray-600">{address.kodPocztowy} {address.miasto}</p>
              {address.czyDomyslny && <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Domyślny</span>}
            </div>
            <div className="flex space-x-3">
              <button onClick={() => handleEdit(address)} className="text-sm text-indigo-600 hover:text-indigo-800">Edytuj</button>
              <button onClick={() => handleDelete(address.id)} className="text-sm text-red-600 hover:text-red-800">Usuń</button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !loading && <p className="text-center text-gray-500 py-10">Nie masz jeszcze zapisanych żadnych adresów.</p>}
      </div>
    </div>
  );
}