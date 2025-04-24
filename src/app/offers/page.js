'use client';

import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    tytul: '',
    rokWydania: '',
    cena: '',
    opisStanu: '',
    statusKsiazkiId: 1
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      setOffers(data);
      setLoading(false);
    } catch (err) {
      setError('Nie udało się załadować ofert');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOffer ? `/api/offers/${editingOffer.id}` : '/api/offers';
      const method = editingOffer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Operacja nie powiodła się');

      setEditingOffer(null);
      setFormData({
        tytul: '',
        rokWydania: '',
        cena: '',
        opisStanu: '',
        statusKsiazkiId: 1
      });
      fetchOffers();
    } catch (err) {
      setError('Nie udało się zapisać oferty');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć tę ofertę?')) return;
    
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Operacja nie powiodła się');

      fetchOffers();
    } catch (err) {
      setError('Nie udało się usunąć oferty');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      tytul: offer.tytul,
      rokWydania: offer.rokWydania || '',
      cena: offer.cena,
      opisStanu: offer.opisStanu,
      statusKsiazkiId: offer.statusKsiazkiId
    });
  };

  if (loading) return <div className="p-4">Ładowanie...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-6">Zarządzanie ofertami</h1>

        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingOffer ? 'Edytuj ofertę' : 'Dodaj nową ofertę'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tytuł</label>
              <input
                type="text"
                value={formData.tytul}
                onChange={(e) => setFormData({ ...formData, tytul: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Rok wydania</label>
              <input
                type="number"
                value={formData.rokWydania}
                onChange={(e) => setFormData({ ...formData, rokWydania: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Cena</label>
              <input
                type="number"
                step="0.01"
                value={formData.cena}
                onChange={(e) => setFormData({ ...formData, cena: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.statusKsiazkiId}
                onChange={(e) => setFormData({ ...formData, statusKsiazkiId: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value={1}>Dostępna</option>
                <option value={2}>Zarezerwowana</option>
                <option value={3}>Sprzedana</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Opis stanu</label>
            <textarea
              value={formData.opisStanu}
              onChange={(e) => setFormData({ ...formData, opisStanu: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div className="mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {editingOffer ? 'Zapisz zmiany' : 'Dodaj ofertę'}
            </button>
            {editingOffer && (
              <button
                type="button"
                onClick={() => {
                  setEditingOffer(null);
                  setFormData({
                    tytul: '',
                    rokWydania: '',
                    cena: '',
                    opisStanu: '',
                    statusKsiazkiId: 1
                  });
                }}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Anuluj
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tytuł
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rok wydania
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cena
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {offer.tytul}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {offer.rokWydania || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(offer.cena).toFixed(2)} zł
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {offer.statusKsiazki?.nazwa || 'Brak statusu'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 