// src/app/admin/delivery-methods/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const initialFormData = { nazwa: '', koszt: '', przewidywanyCzasDostawy: '', czyAktywna: true };

export default function DeliveryMethodsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      // Jako admin, pobieramy wszystkie metody (aktywne i nieaktywne)
      const response = await fetch('/api/delivery-methods?all=true');
      if (!response.ok) throw new Error('Nie udało się pobrać metod dostawy');
      const data = await response.json();
      setMethods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/'); // Przekieruj, jeśli nie admin
      } else {
        fetchMethods();
      }
    } else if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/delivery-methods');
    }
  }, [status, session, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData({
      nazwa: method.nazwa,
      koszt: method.koszt.toString(),
      przewidywanyCzasDostawy: method.przewidywanyCzasDostawy || '',
      czyAktywna: method.czyAktywna,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć tę metodę dostawy?')) return;
    try {
      const response = await fetch(`/api/delivery-methods/${id}`, { method: 'DELETE' });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Błąd usuwania'); }
      fetchMethods();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const url = editingMethod ? `/api/delivery-methods/${editingMethod.id}` : '/api/delivery-methods';
      const method = editingMethod ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Błąd zapisu'); }
      setEditingMethod(null);
      setFormData(initialFormData);
      fetchMethods();
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Zarządzanie Metodami Dostawy</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">{editingMethod ? 'Edytuj metodę' : 'Dodaj nową metodę'}</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nazwa" className="block text-sm font-medium text-gray-700">Nazwa metody</label>
              <input type="text" name="nazwa" id="nazwa" value={formData.nazwa} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="koszt" className="block text-sm font-medium text-gray-700">Koszt (zł)</label>
              <input type="number" step="0.01" name="koszt" id="koszt" value={formData.koszt} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="przewidywanyCzasDostawy" className="block text-sm font-medium text-gray-700">Przewidywany czas dostawy (np. 1-2 dni robocze)</label>
            <input type="text" name="przewidywanyCzasDostawy" id="przewidywanyCzasDostawy" value={formData.przewidywanyCzasDostawy} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input id="czyAktywna" name="czyAktywna" type="checkbox" checked={formData.czyAktywna} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="czyAktywna" className="font-medium text-gray-700">Metoda aktywna (widoczna dla klientów)</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {editingMethod && <button type="button" onClick={() => { setEditingMethod(null); setFormData(initialFormData); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Anuluj</button>}
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">{isSubmitting ? 'Zapisywanie...' : (editingMethod ? 'Zapisz zmiany' : 'Dodaj metodę')}</button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Koszt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Czas dostawy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {methods.map(method => (
              <tr key={method.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{method.nazwa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{method.koszt.toFixed(2)} zł</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{method.przewidywanyCzasDostawy || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${method.czyAktywna ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {method.czyAktywna ? 'Aktywna' : 'Nieaktywna'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(method)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edytuj</button>
                  <button onClick={() => handleDelete(method.id)} className="text-red-600 hover:text-red-900">Usuń</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}