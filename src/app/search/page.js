// app/search/page.js
import prisma from '@/lib/prisma';
import ProductGrid from '@/app/components/ProductGrid';
import Link from 'next/link';

// Funkcja serializacji produktów
const serializeProducts = (productsToSerialize) => {
  return productsToSerialize.map(product => {
    const serializedProduct = {
      ...product,
      cena: product.cena.toNumber(),
      dataDodania: product.dataDodania.toISOString(),
      dataModyfikacji: product.dataModyfikacji ? product.dataModyfikacji.toISOString() : null,
      daneKsiazki: product.daneKsiazki ? { ...product.daneKsiazki } : null,
      daneAudiobooka: product.daneAudiobooka ? { ...product.daneAudiobooka } : null,
      daneEbooka: product.daneEbooka ? { ...product.daneEbooka } : null,
      daneKomiksu: product.daneKomiksu ? { ...product.daneKomiksu } : null,
      daneCzasopisma: product.daneCzasopisma && product.daneCzasopisma.dataWydania ? {
          ...product.daneCzasopisma,
          dataWydania: product.daneCzasopisma.dataWydania.toISOString(),
      } : product.daneCzasopisma,
      daneMapyPrzewodnika: product.daneMapyPrzewodnika ? { ...product.daneMapyPrzewodnika } : null,
      danePodrecznika: product.danePodrecznika ? { ...product.danePodrecznika } : null,
      daneKsiazkiDoNaukiJezyka: product.daneKsiazkiDoNaukiJezyka ? { ...product.daneKsiazkiDoNaukiJezyka } : null,
      daneKsiazkiObcojezycznej: product.daneKsiazkiObcojezycznej ? { ...product.daneKsiazkiObcojezycznej } : null,
      daneZabawki: product.daneZabawki ? { ...product.daneZabawki } : null,
    };
    return serializedProduct;
  });
};

// W pełni uzupełniona funkcja buildWhereClause dla Produktów
function buildWhereClause(searchTerm) {
  const conditions = [];
  if (searchTerm) {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);

    searchWords.forEach(currentWord => { // ZMIANA: nazwa zmiennej z 'word' na 'currentWord' dla jasności
      const isNumber = !isNaN(parseInt(currentWord)); // POPRAWKA: Używamy 'currentWord'
      const numberValue = isNumber ? parseInt(currentWord) : undefined; // POPRAWKA: Używamy 'currentWord'

      conditions.push({
        OR: [
          { tytul: { contains: currentWord } },
          { opis: { contains: currentWord } },
          { opisStanu: { contains: currentWord } },
          { kodEanIsbn: { contains: currentWord } },
          { daneKsiazki: { OR: [
                { wydawnictwo: { contains: currentWord } }, { oprawa: { contains: currentWord } }, { format: { contains: currentWord } },
                isNumber ? { rokWydania: numberValue } : {}, isNumber ? { liczbaStron: numberValue } : {},
                { autorzy: { some: { OR: [ { imie: { contains: currentWord } }, { nazwisko: { contains: currentWord } } ] } } },
                { gatunki: { some: { nazwa: { contains: currentWord } } } },
          ]}},
          { daneAudiobooka: { OR: [
                { lektor: { contains: currentWord } }, { formatPliku: { contains: currentWord } },
                isNumber ? { rokWydania: numberValue } : {}, isNumber ? { czasTrwaniaMin: numberValue } : {},
                { autorzy: { some: { OR: [ { imie: { contains: currentWord } }, { nazwisko: { contains: currentWord } } ] } } },
                { gatunki: { some: { nazwa: { contains: currentWord } } } },
          ]}},
          { daneEbooka: { OR: [
                { formatPliku: { contains: currentWord } }, { zabezpieczenia: { contains: currentWord } },
                isNumber ? { rokWydania: numberValue } : {},
          ]}},
          { daneKomiksu: { OR: [
                { seria: { contains: currentWord } }, { wydawnictwo: { contains: currentWord } }, { oprawa: { contains: currentWord } },
                isNumber ? { rokWydania: numberValue } : {}, isNumber ? { liczbaStron: numberValue } : {}, isNumber ? { numerWSerii: numberValue } : {},
                { scenarzysci: { some: { OR: [ { imie: { contains: currentWord } }, { nazwisko: { contains: currentWord } } ] } } },
                { rysownicy: { some: { OR: [ { imie: { contains: currentWord } }, { nazwisko: { contains: currentWord } } ] } } },
                { gatunki: { some: { nazwa: { contains: currentWord } } } },
          ]}},
          { daneCzasopisma: { OR: [
                { numerWydania: { contains: currentWord } }, { wydawca: { contains: currentWord } }, { czestotliwosc: { contains: currentWord } },
          ]}},
          { daneMapyPrzewodnika: { OR: [
                { skala: { contains: currentWord } }, { region: { contains: currentWord } }, { wydanie: { contains: currentWord } }, { rodzaj: { contains: currentWord } },
                isNumber ? { rokAktualizacji: numberValue } : {},
          ]}},
          { danePodrecznika: { OR: [
                { przedmiot: { contains: currentWord } }, { poziomEdukacji: { contains: currentWord } }, { klasa: { contains: currentWord } },
                { rokSzkolny: { contains: currentWord } }, { numerDopuszczenia: { contains: currentWord } }, { wydawnictwo: { contains: currentWord } },
          ]}},
          { daneKsiazkiDoNaukiJezyka: { OR: [
                { jezykDocelowy: { contains: currentWord } }, { poziomZaawansowania: { contains: currentWord } }, { typMaterialu: { contains: currentWord } },
          ]}},
          { daneKsiazkiObcojezycznej: { OR: [
                { jezykOryginalny: { contains: currentWord } }, { tlumacz: { contains: currentWord } },
                isNumber ? { rokOryginalnegoWydania: numberValue } : {},
          ]}},
          { daneZabawki: { OR: [
                { producent: { contains: currentWord } }, { material: { contains: currentWord } }, { certyfikaty: { contains: currentWord } },
                isNumber ? { wiekDocelowyOd: numberValue } : {}, isNumber ? { wiekDocelowyDo: numberValue } : {},
          ]}},
        ],
      });
    });
  }

  if (conditions.length === 0) return {};
  return { AND: conditions };
}

// Przenosimy odczyt searchParams.q do głównego komponentu strony,
// a do funkcji pobierającej dane przekazujemy już przetworzony searchTerm.
async function getSearchResultsData(processedSearchTerm) {
  let productsRaw = [];
  let error = null;
  let totalProducts = 0;
  const whereClause = buildWhereClause(processedSearchTerm); // Używamy przetworzonego searchTerm

  try {
    [productsRaw, totalProducts] = await Promise.all([
      prisma.produkt.findMany({
        where: whereClause,
        include: {
          typProduktu: true, statusProduktu: true, zdjecia: { where: { czyGlowne: true }, take: 1 },
          daneKsiazki: { include: { autorzy: true, gatunki: true } },
          daneAudiobooka: { include: { autorzy: true, gatunki: true } },
          daneEbooka: true, daneKomiksu: { include: { scenarzysci: true, rysownicy: true, gatunki: true } },
          daneCzasopisma: true, daneMapyPrzewodnika: true, danePodrecznika: true,
          daneKsiazkiDoNaukiJezyka: true, daneKsiazkiObcojezycznej: true, daneZabawki: true,
        },
        orderBy: { dataDodania: 'desc' },
        take: 24,
      }),
      prisma.produkt.count({ where: whereClause })
    ]);
  } catch (e) {
    console.error('Błąd podczas pobierania wyników wyszukiwania:', e);
    error = 'Nie udało się załadować wyników wyszukiwania. Spróbuj ponownie później.';
  }

  const products = productsRaw.length > 0 ? serializeProducts(productsRaw) : [];
  return { products, totalProducts, error, searchTerm: processedSearchTerm }; // Zwracamy przetworzony searchTerm
}

export default async function SearchPage({ searchParams }) {
  // POPRAWKA: Odczyt searchParams.q tutaj, na najwyższym poziomie komponentu serwerowego.
  // To jest miejsce, gdzie Next.js "oczekuje" interakcji z searchParams.
  const searchTermFromUrl = typeof searchParams.q === 'string' ? searchParams.q : '';

  // Przekazujemy już odczytany i przetworzony searchTerm do funkcji pobierającej dane.
  const { products, totalProducts, error, searchTerm } = await getSearchResultsData(searchTermFromUrl);
  const hasSearchParams = !!searchTerm; // searchTerm jest teraz tym, co faktycznie było użyte do wyszukiwania

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {hasSearchParams ? `Wyniki wyszukiwania dla: "${searchTerm}"` : "Wszystkie Produkty"}
          </h1>
          {hasSearchParams && !error && (
            <p className="text-md text-gray-600 mt-1">
              Znaleziono: {totalProducts} {totalProducts === 1 ? 'produkt' : (totalProducts % 10 >= 2 && totalProducts % 10 <= 4 && (totalProducts % 100 < 10 || totalProducts % 100 >= 20)) ? 'produkty' : 'produktów'}.
            </p>
          )}
           {!hasSearchParams && totalProducts > 0 && !error && (
             <p className="text-md text-gray-600 mt-1">
              Przeglądasz wszystkie dostępne produkty. Znaleziono: {totalProducts} {totalProducts === 1 ? 'produkt' : (totalProducts % 10 >= 2 && totalProducts % 10 <= 4 && (totalProducts % 100 < 10 || totalProducts % 100 >= 20)) ? 'produkty' : 'produktów'}.
            </p>
          )}
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-100 p-4 rounded-md shadow">
            {error}
          </p>
        )}

        {!error && products.length > 0 && <ProductGrid products={products} />}

        {!error && products.length === 0 && (
          <div className="text-center py-10 bg-white p-6 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">Brak wyników</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasSearchParams ? "Nie znaleziono produktów pasujących do Twojej frazy. Spróbuj wpisać coś innego lub przeglądaj wszystkie produkty." : "Wygląda na to, że nie mamy jeszcze żadnych produktów w ofercie."}
            </p>
            <div className="mt-6">
              <Link
                href={hasSearchParams ? "/search" : "/"}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {hasSearchParams ? "Pokaż wszystkie produkty" : "Wróć na stronę główną"}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}