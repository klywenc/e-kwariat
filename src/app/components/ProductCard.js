// app/components/ProductCard.js
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // --- Wspólne dane produktu ---
  const title = product.tytul;
  const price = product.cena ? new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(product.cena) : 'N/A';
  const mainImage = product.zdjecia && product.zdjecia.length > 0 && product.zdjecia[0]?.url
      ? product.zdjecia[0].url
      : "/images/cover.png";
  const imageAlt = product.zdjecia && product.zdjecia.length > 0 && product.zdjecia[0]?.opisAlt
      ? product.zdjecia[0].opisAlt
      : `Okładka produktu ${title}`;

  // --- UPROSZCZONA LOGIKA REZERWACJI DLA KARTY ---
  // Używamy teraz prostej flagi `czyZarezerwowany` przekazanej w propsach.
  const isReserved = product.czyZarezerwowany;
  const isAvailableForCart = product.statusProduktu?.nazwa === 'Dostępny' && !isReserved;

  // --- Logika dodawania do koszyka ---
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      window.location.href = '/login';
      return;
    }

    setIsAddingToCart(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produktId: product.id, ilosc: 1 }),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || 'Nie udało się dodać do koszyka');
      setMessage({ type: 'success', content: responseData.message || 'Dodano do koszyka!' });
      setTimeout(() => setMessage({ type: '', content: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', content: err.message });
      console.error("Błąd dodawania do koszyka:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // --- Dynamiczne renderowanie szczegółów w zależności od typu produktu ---
  let specificDetails = null;
  const { typProduktu } = product;

  if (typProduktu?.nazwa === 'Książka' && product.daneKsiazki) {
    const { autorzy, gatunki, rokWydania, wydawnictwo, oprawa, liczbaStron } = product.daneKsiazki;
    const authorsDisplay = autorzy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ') || 'Autor nieznany';
    const genresDisplay = gatunki?.map(g => g.nazwa).join(', ');
    specificDetails = (
        <>
          <p className="text-sm text-gray-600 mt-1 line-clamp-1" title={authorsDisplay}>{authorsDisplay}</p>
          {rokWydania && <p className="text-xs text-gray-500">Rok: {rokWydania}</p>}
          {wydawnictwo && <p className="text-xs text-gray-500">Wyd.: {wydawnictwo}</p>}
          {oprawa && <p className="text-xs text-gray-500">Oprawa: {oprawa}</p>}
          {liczbaStron && <p className="text-xs text-gray-500">Stron: {liczbaStron}</p>}
          {genresDisplay && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1" title={genresDisplay}>Gat.: {genresDisplay}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Audiobook MP3' && product.daneAudiobooka) {
    const { lektor, czasTrwaniaMin, autorzy, gatunki, rokWydania, formatPliku } = product.daneAudiobooka;
    const authorsDisplay = autorzy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ') || '';
    const genresDisplay = gatunki?.map(g => g.nazwa).join(', ');
    specificDetails = (
        <>
          {lektor && <p className="text-sm text-gray-600 mt-1">Lektor: {lektor}</p>}
          {authorsDisplay && <p className="text-sm text-gray-600 mt-0.5">Autor: {authorsDisplay}</p>}
          {rokWydania && <p className="text-xs text-gray-500">Rok: {rokWydania}</p>}
          {czasTrwaniaMin && <p className="text-xs text-gray-500">Czas: {Math.floor(czasTrwaniaMin / 60)}h {czasTrwaniaMin % 60}min</p>}
          {formatPliku && <p className="text-xs text-gray-500">Format: {formatPliku}</p>}
          {genresDisplay && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1" title={genresDisplay}>Gat.: {genresDisplay}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Ebook' && product.daneEbooka) {
    const { formatPliku, rokWydania, zabezpieczenia } = product.daneEbooka;
    specificDetails = (
        <>
          {formatPliku && <p className="text-sm text-gray-600 mt-1">Format: {formatPliku}</p>}
          {rokWydania && <p className="text-xs text-gray-500">Rok: {rokWydania}</p>}
          {zabezpieczenia && <p className="text-xs text-gray-500">Zabezp.: {zabezpieczenia}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Komiks' && product.daneKomiksu) {
    const { scenarzysci, rysownicy, seria, wydawnictwo, rokWydania, oprawa } = product.daneKomiksu;
    const scenarzysciDisplay = scenarzysci?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
    const rysownicyDisplay = rysownicy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
    specificDetails = (
        <>
          {scenarzysciDisplay && <p className="text-sm text-gray-600 mt-1 line-clamp-1">Scenariusz: {scenarzysciDisplay}</p>}
          {rysownicyDisplay && <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">Rysunki: {rysownicyDisplay}</p>}
          {seria && <p className="text-xs text-gray-500">Seria: {seria}</p>}
          {rokWydania && <p className="text-xs text-gray-500">Rok: {rokWydania}</p>}
          {wydawnictwo && <p className="text-xs text-gray-500">Wyd.: {wydawnictwo}</p>}
          {oprawa && <p className="text-xs text-gray-500">Oprawa: {oprawa}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Czasopismo' && product.daneCzasopisma) {
    const { numerWydania, wydawca, dataWydania, czestotliwosc } = product.daneCzasopisma;
    specificDetails = (
        <>
          {numerWydania && <p className="text-sm text-gray-600 mt-1">Numer: {numerWydania}</p>}
          {wydawca && <p className="text-xs text-gray-500">Wydawca: {wydawca}</p>}
          {dataWydania && <p className="text-xs text-gray-500">Data wyd.: {new Date(dataWydania).toLocaleDateString('pl-PL')}</p>}
          {czestotliwosc && <p className="text-xs text-gray-500">Częst.: {czestotliwosc}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Mapa/Przewodnik' && product.daneMapyPrzewodnika) {
    const { skala, region, rodzaj, rokAktualizacji } = product.daneMapyPrzewodnika;
    specificDetails = (
        <>
          {rodzaj && <p className="text-sm text-gray-600 mt-1">{rodzaj}</p>}
          {region && <p className="text-xs text-gray-500">Region: {region}</p>}
          {skala && <p className="text-xs text-gray-500">Skala: {skala}</p>}
          {rokAktualizacji && <p className="text-xs text-gray-500">Aktual.: {rokAktualizacji}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Podręcznik' && product.danePodrecznika) {
    const { przedmiot, poziomEdukacji, klasa, rokWydania, wydawnictwo } = product.danePodrecznika;
    specificDetails = (
        <>
          <p className="text-sm text-gray-600 mt-1">{przedmiot}</p>
          {poziomEdukacji && <p className="text-xs text-gray-500">Poziom: {poziomEdukacji} {klasa ? `(kl. ${klasa})` : ''}</p>}
          {rokWydania && <p className="text-xs text-gray-500">Rok wyd.: {rokWydania}</p>}
          {wydawnictwo && <p className="text-xs text-gray-500">Wyd.: {wydawnictwo}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Książka do nauki języka' && product.daneKsiazkiDoNaukiJezyka) {
    const { jezykDocelowy, poziomZaawansowania, typMaterialu } = product.daneKsiazkiDoNaukiJezyka;
    specificDetails = (
        <>
          <p className="text-sm text-gray-600 mt-1">Język: {jezykDocelowy}</p>
          {poziomZaawansowania && <p className="text-xs text-gray-500">Poziom: {poziomZaawansowania}</p>}
          {typMaterialu && <p className="text-xs text-gray-500">Typ: {typMaterialu}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Książka obcojęzyczna' && product.daneKsiazkiObcojezycznej) {
    const { jezykOryginalny, tlumacz } = product.daneKsiazkiObcojezycznej;
    specificDetails = (
        <>
          <p className="text-sm text-gray-600 mt-1">Język: {jezykOryginalny}</p>
          {tlumacz && <p className="text-xs text-gray-500">Tłumacz: {tlumacz}</p>}
          {product.daneKsiazki?.autorzy?.length > 0 && <p className="text-xs text-gray-500">Autor: {product.daneKsiazki.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ')}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Zabawka' && product.daneZabawki) {
    const { wiekDocelowyOd, producent, material } = product.daneZabawki;
    specificDetails = (
        <>
          {producent && <p className="text-sm text-gray-600 mt-1">Producent: {producent}</p>}
          {wiekDocelowyOd !== null && typeof wiekDocelowyOd !== 'undefined' && <p className="text-xs text-gray-500">Wiek: {wiekDocelowyOd}+</p>}
          {material && <p className="text-xs text-gray-500">Materiał: {material}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Outlet') {
    specificDetails = (
        <>
          <p className="text-sm text-red-600 font-semibold mt-1">Produkt outletowy</p>
          {product.opisStanu && <p className="text-xs text-gray-500">Stan: {product.opisStanu}</p>}
        </>
    );
  } else if (typProduktu?.nazwa === 'Pozostałe') {
    specificDetails = (
        <>
          {product.opis && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.opis}</p>}
        </>
    );
  }

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
        <Link href={`/product/${product.id}`} className="block flex flex-col flex-grow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-t-lg">
          <div className="relative w-full h-56 sm:h-64 bg-gray-200">
            <Image
                src={mainImage}
                alt={imageAlt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={false}
            />
            {isReserved ? (
                <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    Zarezerwowany
                </span>
            ) : (
                product.statusProduktu?.nazwa && product.statusProduktu.nazwa !== 'Dostępny' && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                        {product.statusProduktu.nazwa}
                    </span>
                )
            )}
            <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
              {typProduktu?.nazwa || 'Produkt'}
            </div>
          </div>
          <div className="p-3 flex flex-col flex-grow">
            <h3 className="text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight mb-1" title={title}>
              {title}
            </h3>
            <div className="text-xs text-gray-500 space-y-0.5">
              {specificDetails}
            </div>
            <div className="mt-auto pt-2">
              <p className="text-lg font-bold text-indigo-600">
                {price}
              </p>
            </div>
          </div>
        </Link>

        <div className="px-3 pb-3 pt-2 border-t border-gray-100">
          <button
              onClick={handleAddToCart}
              disabled={!isAvailableForCart || isAddingToCart}
              className={`w-full py-2 px-3 rounded-md transition duration-200 text-sm font-medium flex items-center justify-center ${
                  isAvailableForCart
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isAddingToCart ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Dodawanie...
                </>
            ) : isReserved ? (
                'Zarezerwowane'
            ) : isAvailableForCart ? (
                'Dodaj do koszyka'
            ) : (
                product.statusProduktu?.nazwa || 'Niedostępny'
            )}
          </button>
          {message.content && (
              <p className={`text-xs mt-2 text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {message.content}
              </p>
          )}
        </div>
      </div>
  );
}