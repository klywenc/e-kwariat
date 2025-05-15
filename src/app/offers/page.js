// src/app/offers/page.js
'use client';

import { useState, useEffect } from 'react';

// Domyślny stan formularza dla nowego produktu
const getInitialFormData = (defaultStatusId = '', defaultTypeId = '') => ({
  tytul: '',
  cena: '',
  opisStanu: '',
  opis: '',
  kodEanIsbn: '',
  statusProduktuId: defaultStatusId,
  typProduktuId: defaultTypeId,
  czyPolecany: false,
  czyNowosc: false,
  // Pola dla danych specyficznych - inicjowane jako puste lub z domyślnymi wartościami
  daneKsiazki: { rokWydania: '', liczbaStron: '', wydawnictwo: '', oprawa: '', format: '', autorzyIds: [], gatunkiIds: [] },
  daneAudiobooka: { lektor: '', czasTrwaniaMin: '', formatPliku: 'MP3', rokWydania: '', autorzyIds: [], gatunkiIds: [] },
  daneEbooka: { formatPliku: '', zabezpieczenia: '', rokWydania: '' },
  daneKomiksu: { seria: '', numerWSerii: '', wydawnictwo: '', rokWydania: '', liczbaStron: '', oprawa: '', scenarzysciIds: [], rysownicyIds: [], gatunkiIds: [] },
  daneCzasopisma: { numerWydania: '', wydawca: '', czestotliwosc: '', dataWydania: '' },
  daneMapyPrzewodnika: { skala: '', region: '', wydanie: '', rokAktualizacji: '', rodzaj: '' },
  danePodrecznika: { przedmiot: '', poziomEdukacji: '', klasa: '', rokSzkolny: '', numerDopuszczenia: '', wydawnictwo: '' },
  daneKsiazkiDoNaukiJezyka: { jezykDocelowy: '', poziomZaawansowania: '', zawieraAudio: false, typMaterialu: '' },
  daneKsiazkiObcojezycznej: { jezykOryginalny: '', tlumacz: '', rokOryginalnegoWydania: '' },
  daneZabawki: { wiekDocelowyOd: '', wiekDocelowyDo: '', producent: '', material: '', certyfikaty: '' },
});

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [productStatuses, setProductStatuses] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]); // Dla rysowników komiksów

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    fetchAllInitialData();
  }, []);

  const fetchAllInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, typesRes, statusesRes, authorsRes, genresRes, artistsRes] = await Promise.all([
        fetch('/api/offers'),
        fetch('/api/product-types'), // Musisz stworzyć ten endpoint
        fetch('/api/product-statuses'), // Musisz stworzyć ten endpoint
        fetch('/api/authors'), // Musisz stworzyć ten endpoint
        fetch('/api/genres'),  // Musisz stworzyć ten endpoint
        fetch('/api/artists'), // Musisz stworzyć ten endpoint
      ]);

      if (!productsRes.ok) throw new Error('Nie udało się załadować ofert');
      if (!typesRes.ok) throw new Error('Nie udało się załadować typów produktów');
      if (!statusesRes.ok) throw new Error('Nie udało się załadować statusów produktów');
      if (!authorsRes.ok) throw new Error('Nie udało się załadować autorów');
      if (!genresRes.ok) throw new Error('Nie udało się załadować gatunków');
      if (!artistsRes.ok) throw new Error('Nie udało się załadować artystów');


      const productsData = await productsRes.json();
      const typesData = await typesRes.json();
      const statusesData = await statusesRes.json();
      const authorsData = await authorsRes.json();
      const genresData = await genresRes.json();
      const artistsData = await artistsRes.json();

      setProducts(productsData);
      setProductTypes(typesData);
      setProductStatuses(statusesData);
      setAuthors(authorsData);
      setGenres(genresData);
      setArtists(artistsData);

      const defaultStatusId = statusesData.length > 0 ? statusesData[0].id.toString() : '';
      const defaultTypeId = typesData.length > 0 ? typesData[0].id.toString() : '';
      
      if (!editingProduct) { // Ustaw domyślne tylko jeśli nie edytujemy
        setFormData(getInitialFormData(defaultStatusId, defaultTypeId));
      }

    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas ładowania danych inicjalizacyjnych');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificDataChange = (specificTypeKey, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [specificTypeKey]: {
        ...(prev[specificTypeKey] || {}), // Upewnij się, że obiekt istnieje
        [fieldName]: value,
      },
    }));
  };
  
  // Dla multi-select (np. autorzy, gatunki)
  const handleMultiSelectChange = (specificTypeKey, fieldName, selectedOptions) => {
    const ids = Array.from(selectedOptions).map(option => parseInt(option.value));
    handleSpecificDataChange(specificTypeKey, fieldName, ids);
  };


  const resetForm = () => {
    const defaultStatusId = productStatuses.length > 0 ? productStatuses[0].id.toString() : '';
    const defaultTypeId = productTypes.length > 0 ? productTypes[0].id.toString() : '';
    setFormData(getInitialFormData(defaultStatusId, defaultTypeId));
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    const payload = {
      tytul: formData.tytul,
      cena: parseFloat(formData.cena),
      opisStanu: formData.opisStanu,
      opis: formData.opis,
      kodEanIsbn: formData.kodEanIsbn,
      statusProduktuId: parseInt(formData.statusProduktuId),
      typProduktuId: parseInt(formData.typProduktuId),
      czyPolecany: formData.czyPolecany,
      czyNowosc: formData.czyNowosc,
      // Zdjęcia - do obsłużenia osobno (np. upload i przekazanie URLi)
      // zdjeciaUrls: formData.zdjeciaUrls || [], 
      // zdjeciaAlts: formData.zdjeciaAlts || [],
    };

    const selectedProductTypeObject = productTypes.find(pt => pt.id === parseInt(formData.typProduktuId));
    const selectedProductTypeName = selectedProductTypeObject?.nazwa;

    // Dodawanie danych specyficznych
    if (selectedProductTypeName === 'Książka' && formData.daneKsiazki) {
      payload.daneKsiazki = { ...formData.daneKsiazki, rokWydania: formData.daneKsiazki.rokWydania ? parseInt(formData.daneKsiazki.rokWydania) : null, liczbaStron: formData.daneKsiazki.liczbaStron ? parseInt(formData.daneKsiazki.liczbaStron) : null };
    } else if (selectedProductTypeName === 'Audiobook MP3' && formData.daneAudiobooka) {
      payload.daneAudiobooka = { ...formData.daneAudiobooka, rokWydania: formData.daneAudiobooka.rokWydania ? parseInt(formData.daneAudiobooka.rokWydania) : null, czasTrwaniaMin: formData.daneAudiobooka.czasTrwaniaMin ? parseInt(formData.daneAudiobooka.czasTrwaniaMin) : null };
    } else if (selectedProductTypeName === 'Ebook' && formData.daneEbooka) {
      payload.daneEbooka = { ...formData.daneEbooka, rokWydania: formData.daneEbooka.rokWydania ? parseInt(formData.daneEbooka.rokWydania) : null };
    } else if (selectedProductTypeName === 'Komiks' && formData.daneKomiksu) {
      payload.daneKomiksu = { ...formData.daneKomiksu, rokWydania: formData.daneKomiksu.rokWydania ? parseInt(formData.daneKomiksu.rokWydania) : null, liczbaStron: formData.daneKomiksu.liczbaStron ? parseInt(formData.daneKomiksu.liczbaStron) : null, numerWSerii: formData.daneKomiksu.numerWSerii ? parseInt(formData.daneKomiksu.numerWSerii) : null };
    } else if (selectedProductTypeName === 'Czasopismo' && formData.daneCzasopisma) {
      payload.daneCzasopisma = { ...formData.daneCzasopisma, dataWydania: formData.daneCzasopisma.dataWydania ? new Date(formData.daneCzasopisma.dataWydania).toISOString() : null };
    } else if (selectedProductTypeName === 'Mapa/Przewodnik' && formData.daneMapyPrzewodnika) {
      payload.daneMapyPrzewodnika = { ...formData.daneMapyPrzewodnika, rokAktualizacji: formData.daneMapyPrzewodnika.rokAktualizacji ? parseInt(formData.daneMapyPrzewodnika.rokAktualizacji) : null };
    } else if (selectedProductTypeName === 'Podręcznik' && formData.danePodrecznika) {
      payload.danePodrecznika = { ...formData.danePodrecznika };
    } else if (selectedProductTypeName === 'Książka do nauki języka' && formData.daneKsiazkiDoNaukiJezyka) {
      payload.daneKsiazkiDoNaukiJezyka = { ...formData.daneKsiazkiDoNaukiJezyka };
    } else if (selectedProductTypeName === 'Książka obcojęzyczna' && formData.daneKsiazkiObcojezycznej) {
      payload.daneKsiazkiObcojezycznej = { ...formData.daneKsiazkiObcojezycznej, rokOryginalnegoWydania: formData.daneKsiazkiObcojezycznej.rokOryginalnegoWydania ? parseInt(formData.daneKsiazkiObcojezycznej.rokOryginalnegoWydania) : null };
    } else if (selectedProductTypeName === 'Zabawka' && formData.daneZabawki) {
      payload.daneZabawki = { ...formData.daneZabawki, wiekDocelowyOd: formData.daneZabawki.wiekDocelowyOd ? parseInt(formData.daneZabawki.wiekDocelowyOd) : null, wiekDocelowyDo: formData.daneZabawki.wiekDocelowyDo ? parseInt(formData.daneZabawki.wiekDocelowyDo) : null };
    }
    // Dla 'Outlet' i 'Pozostałe' nie ma dodatkowych danych specyficznych w payload.

    try {
      const url = editingProduct ? `/api/offers/${editingProduct.id}` : '/api/offers';
      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Operacja nie powiodła się'); }
      resetForm();
      fetchAllInitialData(); // Odśwież listę produktów
    } catch (err) {
      setError(err.message || 'Nie udało się zapisać oferty');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć tę ofertę?')) return;
    setFormLoading(true);
    try {
      const response = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Operacja nie powiodła się'); }
      fetchAllInitialData(); // Odśwież listę
    } catch (err) {
      setError(err.message || 'Nie udało się usunąć oferty');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const defaultStatusId = productStatuses.length > 0 ? productStatuses[0].id.toString() : '';
    const defaultTypeId = productTypes.length > 0 ? productTypes[0].id.toString() : '';

    const baseData = {
      tytul: product.tytul || '',
      cena: product.cena?.toString() || '',
      opisStanu: product.opisStanu || '',
      opis: product.opis || '',
      kodEanIsbn: product.kodEanIsbn || '',
      statusProduktuId: product.statusProduktuId?.toString() || defaultStatusId,
      typProduktuId: product.typProduktuId?.toString() || defaultTypeId,
      czyPolecany: product.czyPolecany || false,
      czyNowosc: product.czyNowosc || false,
    };

    // Inicjalizujemy wszystkie możliwe dane specyficzne, a potem nadpisujemy istniejącymi
    let specificData = getInitialFormData()['daneKsiazki'] ? { daneKsiazki: { ...getInitialFormData()['daneKsiazki']} } : {};
    // ... i tak dla wszystkich typów
    
    const productTypeName = product.typProduktu?.nazwa;

    if (productTypeName === 'Książka' && product.daneKsiazki) {
      specificData.daneKsiazki = { ...getInitialFormData().daneKsiazki, ...product.daneKsiazki, autorzyIds: product.daneKsiazki.autorzy?.map(a => a.id) || [], gatunkiIds: product.daneKsiazki.gatunki?.map(g => g.id) || [] };
    } else if (productTypeName === 'Audiobook MP3' && product.daneAudiobooka) {
      specificData.daneAudiobooka = { ...getInitialFormData().daneAudiobooka, ...product.daneAudiobooka, autorzyIds: product.daneAudiobooka.autorzy?.map(a => a.id) || [], gatunkiIds: product.daneAudiobooka.gatunki?.map(g => g.id) || [] };
    } else if (productTypeName === 'Ebook' && product.daneEbooka) {
      specificData.daneEbooka = { ...getInitialFormData().daneEbooka, ...product.daneEbooka };
    } else if (productTypeName === 'Komiks' && product.daneKomiksu) {
      specificData.daneKomiksu = { ...getInitialFormData().daneKomiksu, ...product.daneKomiksu, scenarzysciIds: product.daneKomiksu.scenarzysci?.map(a => a.id) || [], rysownicyIds: product.daneKomiksu.rysownicy?.map(a => a.id) || [], gatunkiIds: product.daneKomiksu.gatunki?.map(g => g.id) || [] };
    } else if (productTypeName === 'Czasopismo' && product.daneCzasopisma) {
      specificData.daneCzasopisma = { ...getInitialFormData().daneCzasopisma, ...product.daneCzasopisma, dataWydania: product.daneCzasopisma.dataWydania ? new Date(product.daneCzasopisma.dataWydania).toISOString().split('T')[0] : '' };
    } else if (productTypeName === 'Mapa/Przewodnik' && product.daneMapyPrzewodnika) {
      specificData.daneMapyPrzewodnika = { ...getInitialFormData().daneMapyPrzewodnika, ...product.daneMapyPrzewodnika };
    } else if (productTypeName === 'Podręcznik' && product.danePodrecznika) {
      specificData.danePodrecznika = { ...getInitialFormData().danePodrecznika, ...product.danePodrecznika };
    } else if (productTypeName === 'Książka do nauki języka' && product.daneKsiazkiDoNaukiJezyka) {
      specificData.daneKsiazkiDoNaukiJezyka = { ...getInitialFormData().daneKsiazkiDoNaukiJezyka, ...product.daneKsiazkiDoNaukiJezyka };
    } else if (productTypeName === 'Książka obcojęzyczna' && product.daneKsiazkiObcojezycznej) {
      specificData.daneKsiazkiObcojezycznej = { ...getInitialFormData().daneKsiazkiObcojezycznej, ...product.daneKsiazkiObcojezycznej };
    } else if (productTypeName === 'Zabawka' && product.daneZabawki) {
      specificData.daneZabawki = { ...getInitialFormData().daneZabawki, ...product.daneZabawki };
    }
    // Dla 'Outlet' i 'Pozostałe' nie ma specyficznych danych do załadowania do formularza.

    setFormData({ ...getInitialFormData(baseData.statusProduktuId, baseData.typProduktuId), ...baseData, ...specificData });
  };


  // --- Renderowanie dynamicznych pól formularza ---
  const renderSpecificFields = () => {
    const selectedProductTypeObject = productTypes.find(pt => pt.id === parseInt(formData.typProduktuId));
    const selectedProductTypeName = selectedProductTypeObject?.nazwa;

    if (!selectedProductTypeName) return null;

    switch (selectedProductTypeName) {
      case 'Książka':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane książki</h3>
            <InputField label="Rok wydania" name="rokWydania" type="number" value={formData.daneKsiazki?.rokWydania || ''} onChange={(e) => handleSpecificDataChange('daneKsiazki', 'rokWydania', e.target.value)} />
            <InputField label="Liczba stron" name="liczbaStron" type="number" value={formData.daneKsiazki?.liczbaStron || ''} onChange={(e) => handleSpecificDataChange('daneKsiazki', 'liczbaStron', e.target.value)} />
            <InputField label="Wydawnictwo" name="wydawnictwo" value={formData.daneKsiazki?.wydawnictwo || ''} onChange={(e) => handleSpecificDataChange('daneKsiazki', 'wydawnictwo', e.target.value)} />
            <InputField label="Oprawa" name="oprawa" value={formData.daneKsiazki?.oprawa || ''} onChange={(e) => handleSpecificDataChange('daneKsiazki', 'oprawa', e.target.value)} />
            <InputField label="Format (np. A5)" name="format" value={formData.daneKsiazki?.format || ''} onChange={(e) => handleSpecificDataChange('daneKsiazki', 'format', e.target.value)} />
            <MultiSelectField label="Autorzy" name="autorzyIds" options={authors} value={formData.daneKsiazki?.autorzyIds || []} onChange={(e) => handleMultiSelectChange('daneKsiazki', 'autorzyIds', e.target.selectedOptions)} />
            <MultiSelectField label="Gatunki" name="gatunkiIds" options={genres} value={formData.daneKsiazki?.gatunkiIds || []} onChange={(e) => handleMultiSelectChange('daneKsiazki', 'gatunkiIds', e.target.selectedOptions)} />
          </>
        );
      case 'Audiobook MP3':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane audiobooka</h3>
            <InputField label="Lektor" name="lektor" value={formData.daneAudiobooka?.lektor || ''} onChange={(e) => handleSpecificDataChange('daneAudiobooka', 'lektor', e.target.value)} />
            <InputField label="Czas trwania (min)" name="czasTrwaniaMin" type="number" value={formData.daneAudiobooka?.czasTrwaniaMin || ''} onChange={(e) => handleSpecificDataChange('daneAudiobooka', 'czasTrwaniaMin', e.target.value)} />
            <InputField label="Format pliku" name="formatPliku" value={formData.daneAudiobooka?.formatPliku || 'MP3'} onChange={(e) => handleSpecificDataChange('daneAudiobooka', 'formatPliku', e.target.value)} />
            <InputField label="Rok wydania" name="rokWydania" type="number" value={formData.daneAudiobooka?.rokWydania || ''} onChange={(e) => handleSpecificDataChange('daneAudiobooka', 'rokWydania', e.target.value)} />
            <MultiSelectField label="Autorzy (oryginału)" name="autorzyIds" options={authors} value={formData.daneAudiobooka?.autorzyIds || []} onChange={(e) => handleMultiSelectChange('daneAudiobooka', 'autorzyIds', e.target.selectedOptions)} />
            <MultiSelectField label="Gatunki" name="gatunkiIds" options={genres} value={formData.daneAudiobooka?.gatunkiIds || []} onChange={(e) => handleMultiSelectChange('daneAudiobooka', 'gatunkiIds', e.target.selectedOptions)} />
          </>
        );
      case 'Ebook':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane ebooka</h3>
            <InputField label="Format pliku (np. EPUB, MOBI)" name="formatPliku" value={formData.daneEbooka?.formatPliku || ''} onChange={(e) => handleSpecificDataChange('daneEbooka', 'formatPliku', e.target.value)} required />
            <InputField label="Zabezpieczenia (np. Watermark)" name="zabezpieczenia" value={formData.daneEbooka?.zabezpieczenia || ''} onChange={(e) => handleSpecificDataChange('daneEbooka', 'zabezpieczenia', e.target.value)} />
            <InputField label="Rok wydania" name="rokWydania" type="number" value={formData.daneEbooka?.rokWydania || ''} onChange={(e) => handleSpecificDataChange('daneEbooka', 'rokWydania', e.target.value)} />
          </>
        );
      case 'Komiks':
         return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane komiksu</h3>
            <InputField label="Seria" name="seria" value={formData.daneKomiksu?.seria || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'seria', e.target.value)} />
            <InputField label="Numer w serii" name="numerWSerii" type="number" value={formData.daneKomiksu?.numerWSerii || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'numerWSerii', e.target.value)} />
            <InputField label="Wydawnictwo" name="wydawnictwo" value={formData.daneKomiksu?.wydawnictwo || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'wydawnictwo', e.target.value)} />
            <InputField label="Rok wydania" name="rokWydania" type="number" value={formData.daneKomiksu?.rokWydania || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'rokWydania', e.target.value)} />
            <InputField label="Liczba stron" name="liczbaStron" type="number" value={formData.daneKomiksu?.liczbaStron || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'liczbaStron', e.target.value)} />
            <InputField label="Oprawa" name="oprawa" value={formData.daneKomiksu?.oprawa || ''} onChange={(e) => handleSpecificDataChange('daneKomiksu', 'oprawa', e.target.value)} />
            <MultiSelectField label="Scenarzyści (Autorzy)" name="scenarzysciIds" options={authors} value={formData.daneKomiksu?.scenarzysciIds || []} onChange={(e) => handleMultiSelectChange('daneKomiksu', 'scenarzysciIds', e.target.selectedOptions)} />
            <MultiSelectField label="Rysownicy (Artyści)" name="rysownicyIds" options={artists} value={formData.daneKomiksu?.rysownicyIds || []} onChange={(e) => handleMultiSelectChange('daneKomiksu', 'rysownicyIds', e.target.selectedOptions)} />
            <MultiSelectField label="Gatunki" name="gatunkiIds" options={genres} value={formData.daneKomiksu?.gatunkiIds || []} onChange={(e) => handleMultiSelectChange('daneKomiksu', 'gatunkiIds', e.target.selectedOptions)} />
          </>
        );
      case 'Czasopismo':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane czasopisma</h3>
            <InputField label="Numer wydania" name="numerWydania" value={formData.daneCzasopisma?.numerWydania || ''} onChange={(e) => handleSpecificDataChange('daneCzasopisma', 'numerWydania', e.target.value)} />
            <InputField label="Wydawca" name="wydawca" value={formData.daneCzasopisma?.wydawca || ''} onChange={(e) => handleSpecificDataChange('daneCzasopisma', 'wydawca', e.target.value)} />
            <InputField label="Częstotliwość" name="czestotliwosc" value={formData.daneCzasopisma?.czestotliwosc || ''} onChange={(e) => handleSpecificDataChange('daneCzasopisma', 'czestotliwosc', e.target.value)} />
            <InputField label="Data wydania" name="dataWydania" type="date" value={formData.daneCzasopisma?.dataWydania || ''} onChange={(e) => handleSpecificDataChange('daneCzasopisma', 'dataWydania', e.target.value)} />
          </>
        );
      case 'Mapa/Przewodnik':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane mapy/przewodnika</h3>
            <InputField label="Rodzaj (np. Mapa turystyczna)" name="rodzaj" value={formData.daneMapyPrzewodnika?.rodzaj || ''} onChange={(e) => handleSpecificDataChange('daneMapyPrzewodnika', 'rodzaj', e.target.value)} />
            <InputField label="Region" name="region" value={formData.daneMapyPrzewodnika?.region || ''} onChange={(e) => handleSpecificDataChange('daneMapyPrzewodnika', 'region', e.target.value)} />
            <InputField label="Skala (dla map)" name="skala" value={formData.daneMapyPrzewodnika?.skala || ''} onChange={(e) => handleSpecificDataChange('daneMapyPrzewodnika', 'skala', e.target.value)} />
            <InputField label="Wydanie" name="wydanie" value={formData.daneMapyPrzewodnika?.wydanie || ''} onChange={(e) => handleSpecificDataChange('daneMapyPrzewodnika', 'wydanie', e.target.value)} />
            <InputField label="Rok aktualizacji" name="rokAktualizacji" type="number" value={formData.daneMapyPrzewodnika?.rokAktualizacji || ''} onChange={(e) => handleSpecificDataChange('daneMapyPrzewodnika', 'rokAktualizacji', e.target.value)} />
          </>
        );
      case 'Podręcznik':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane podręcznika</h3>
            <InputField label="Przedmiot" name="przedmiot" value={formData.danePodrecznika?.przedmiot || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'przedmiot', e.target.value)} required />
            <InputField label="Poziom edukacji" name="poziomEdukacji" value={formData.danePodrecznika?.poziomEdukacji || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'poziomEdukacji', e.target.value)} required />
            <InputField label="Klasa" name="klasa" value={formData.danePodrecznika?.klasa || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'klasa', e.target.value)} />
            <InputField label="Rok szkolny (np. 2024/2025)" name="rokSzkolny" value={formData.danePodrecznika?.rokSzkolny || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'rokSzkolny', e.target.value)} />
            <InputField label="Numer dopuszczenia MEN" name="numerDopuszczenia" value={formData.danePodrecznika?.numerDopuszczenia || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'numerDopuszczenia', e.target.value)} />
            <InputField label="Wydawnictwo" name="wydawnictwo" value={formData.danePodrecznika?.wydawnictwo || ''} onChange={(e) => handleSpecificDataChange('danePodrecznika', 'wydawnictwo', e.target.value)} />
          </>
        );
      case 'Książka do nauki języka':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane książki do nauki języka</h3>
            <InputField label="Język docelowy" name="jezykDocelowy" value={formData.daneKsiazkiDoNaukiJezyka?.jezykDocelowy || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiDoNaukiJezyka', 'jezykDocelowy', e.target.value)} required />
            <InputField label="Poziom zaawansowania (np. A1, B2)" name="poziomZaawansowania" value={formData.daneKsiazkiDoNaukiJezyka?.poziomZaawansowania || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiDoNaukiJezyka', 'poziomZaawansowania', e.target.value)} />
            <InputField label="Typ materiału (np. Podręcznik, Ćwiczenia)" name="typMaterialu" value={formData.daneKsiazkiDoNaukiJezyka?.typMaterialu || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiDoNaukiJezyka', 'typMaterialu', e.target.value)} />
            <div className="col-span-full sm:col-span-1 flex items-center mt-1">
                <input id="zawieraAudio" name="zawieraAudio" type="checkbox" checked={formData.daneKsiazkiDoNaukiJezyka?.zawieraAudio || false} onChange={(e) => handleSpecificDataChange('daneKsiazkiDoNaukiJezyka', 'zawieraAudio', e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="zawieraAudio" className="ml-2 block text-sm text-gray-900">Zawiera audio</label>
            </div>
          </>
        );
      case 'Książka obcojęzyczna':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane książki obcojęzycznej</h3>
            <InputField label="Język oryginalny" name="jezykOryginalny" value={formData.daneKsiazkiObcojezycznej?.jezykOryginalny || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiObcojezycznej', 'jezykOryginalny', e.target.value)} required />
            <InputField label="Tłumacz (jeśli dotyczy)" name="tlumacz" value={formData.daneKsiazkiObcojezycznej?.tlumacz || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiObcojezycznej', 'tlumacz', e.target.value)} />
            <InputField label="Rok oryginalnego wydania" name="rokOryginalnegoWydania" type="number" value={formData.daneKsiazkiObcojezycznej?.rokOryginalnegoWydania || ''} onChange={(e) => handleSpecificDataChange('daneKsiazkiObcojezycznej', 'rokOryginalnegoWydania', e.target.value)} />
             {/* Można dodać pola na autorów/gatunki, jeśli są inne niż dla standardowej książki */}
          </>
        );
      case 'Zabawka':
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2 col-span-full">Dane zabawki</h3>
            <InputField label="Wiek docelowy od (lat)" name="wiekDocelowyOd" type="number" value={formData.daneZabawki?.wiekDocelowyOd || ''} onChange={(e) => handleSpecificDataChange('daneZabawki', 'wiekDocelowyOd', e.target.value)} />
            <InputField label="Wiek docelowy do (lat)" name="wiekDocelowyDo" type="number" value={formData.daneZabawki?.wiekDocelowyDo || ''} onChange={(e) => handleSpecificDataChange('daneZabawki', 'wiekDocelowyDo', e.target.value)} />
            <InputField label="Producent" name="producent" value={formData.daneZabawki?.producent || ''} onChange={(e) => handleSpecificDataChange('daneZabawki', 'producent', e.target.value)} />
            <InputField label="Materiał" name="material" value={formData.daneZabawki?.material || ''} onChange={(e) => handleSpecificDataChange('daneZabawki', 'material', e.target.value)} />
            <InputField label="Certyfikaty" name="certyfikaty" value={formData.daneZabawki?.certyfikaty || ''} onChange={(e) => handleSpecificDataChange('daneZabawki', 'certyfikaty', e.target.value)} />
          </>
        );
      case 'Outlet':
      case 'Pozostałe':
        // Dla tych typów nie ma dodatkowych specyficznych pól w formularzu
        return <p className="text-sm text-gray-500 col-span-full mt-4">Dla tego typu produktu nie ma dodatkowych specyficznych pól.</p>;
      default:
        return null;
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div><p className="ml-3">Ładowanie danych...</p></div>;
  if (error && products.length === 0) return <div className="p-4 text-red-500 text-center">Błąd: {error} <button onClick={fetchAllInitialData} className="ml-2 text-indigo-600 hover:underline">Spróbuj ponownie</button></div>;

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Zarządzanie Ofertami Produktów</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="mb-12 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-3">
            {editingProduct ? `Edytuj produkt: ${editingProduct.tytul}` : 'Dodaj nowy produkt'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Pola wspólne dla wszystkich produktów */}
            <InputField label="Tytuł" name="tytul" value={formData.tytul} onChange={handleInputChange} required />
            <InputField label="Cena (zł)" name="cena" type="number" step="0.01" value={formData.cena} onChange={handleInputChange} required />
            
            <SelectField label="Typ produktu" name="typProduktuId" value={formData.typProduktuId} onChange={handleInputChange} options={productTypes} required />
            <SelectField label="Status produktu" name="statusProduktuId" value={formData.statusProduktuId} onChange={handleInputChange} options={productStatuses} required />

            <div className="sm:col-span-2">
              <label htmlFor="opisStanu" className="block text-sm font-medium text-gray-700">Opis stanu</label>
              <textarea id="opisStanu" name="opisStanu" value={formData.opisStanu} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="opis" className="block text-sm font-medium text-gray-700">Opis ogólny produktu</label>
              <textarea id="opis" name="opis" value={formData.opis} onChange={handleInputChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <InputField label="Kod EAN/ISBN (opcjonalnie)" name="kodEanIsbn" value={formData.kodEanIsbn} onChange={handleInputChange} />
            
            <div className="flex items-center space-x-4 sm:col-span-2">
                <div className="flex items-center">
                    <input id="czyPolecany" name="czyPolecany" type="checkbox" checked={formData.czyPolecany || false} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="czyPolecany" className="ml-2 block text-sm text-gray-900">Produkt polecany</label>
                </div>
                <div className="flex items-center">
                    <input id="czyNowosc" name="czyNowosc" type="checkbox" checked={formData.czyNowosc || false} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="czyNowosc" className="ml-2 block text-sm text-gray-900">Nowość</label>
                </div>
            </div>

            {/* Dynamicznie renderowane pola specyficzne dla typu */}
            {renderSpecificFields()}
          </div>
          
          <div className="mt-8 pt-5 border-t">
            <div className="flex justify-end">
              {editingProduct && (
                <button type="button" onClick={resetForm} disabled={formLoading} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Anuluj edycję
                </button>
              )}
              <button type="submit" disabled={formLoading} className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${formLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}>
                {formLoading ? 'Przetwarzanie...' : (editingProduct ? 'Zapisz zmiany' : 'Dodaj produkt')}
              </button>
            </div>
          </div>
        </form>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Lista produktów</h2>
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tytuł</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 && !loading && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Brak produktów do wyświetlenia.</td></tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.tytul}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.typProduktu?.nazwa || '-'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.cena ? `${parseFloat(product.cena).toFixed(2)} zł` : '-'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.statusProduktu?.nazwa === 'Dostępny' ? 'bg-green-100 text-green-800' :
                        product.statusProduktu?.nazwa === 'Wyprzedany' ? 'bg-red-100 text-red-800' :
                        product.statusProduktu?.nazwa === 'Zarezerwowany' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {product.statusProduktu?.nazwa || 'Brak'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edytuj</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Usuń</button>
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

// Komponenty pomocnicze dla pól formularza (można je przenieść do osobnych plików)
const InputField = ({ label, name, type = 'text', value, onChange, required = false, step, placeholder }) => (
  <div className="sm:col-span-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
    <input type={type} name={name} id={name} value={value} onChange={onChange} required={required} step={step} placeholder={placeholder}
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false, optionValue = "id", optionLabel = "nazwa" }) => (
  <div className="sm:col-span-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
    <select id={name} name={name} value={value} onChange={onChange} required={required}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3">
      <option value="">-- Wybierz --</option>
      {options.map(option => (
        <option key={option[optionValue]} value={option[optionValue]}>{option[optionLabel]}</option>
      ))}
    </select>
  </div>
);

const MultiSelectField = ({ label, name, options, value, onChange, optionValue = "id", optionLabel = "nazwa" }) => (
  <div className="sm:col-span-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select multiple id={name} name={name} value={value} onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32 py-2 px-3">
      {options.map(option => (
        <option key={option[optionValue]} value={option[optionValue]}>{option[optionLabel]}</option>
      ))}
    </select>
    <p className="mt-1 text-xs text-gray-500">Przytrzymaj Ctrl (lub Cmd na Mac), aby wybrać wiele opcji.</p>
  </div>
);