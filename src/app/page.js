// app/page.js
import prisma from '@/lib/prisma';
import ProductGrid from '@/app/components/ProductGrid';
import CategorySidebar from '@/app/components/CategorySidebar'; // Importujemy nowy komponent
import Link from 'next/link';

// Funkcja serializacji produktów (pozostaje taka sama)
const serializeProducts = (productsToSerialize) => {
  return productsToSerialize.map(product => {
    const serializedProduct = {
      ...product,
      cena: product.cena.toNumber(),
      dataDodania: product.dataDodania.toISOString(),
      dataModyfikacji: product.dataModyfikacji ? product.dataModyfikacji.toISOString() : null,
      daneKsiazki: product.daneKsiazki ? { ...product.daneKsiazki } : null,
      daneAudiobooka: product.daneAudiobooka ? { ...product.daneAudiobooka } : null,
      daneKomiksu: product.daneKomiksu ? { ...product.daneKomiksu } : null,
      daneZabawki: product.daneZabawki ? { ...product.daneZabawki } : null,
    };
    return serializedProduct;
  });
};

// Funkcja do pobierania danych dla strony głównej
async function getHomePageData(searchParams) {
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : null;

  let productsRaw = [];
  let productCategories = [];
  let error = null;
  let selectedCategoryName = null;

  try {
    // Pobieramy typy produktów (kategorie)
    productCategories = await prisma.typProduktu.findMany({
      orderBy: { nazwa: 'asc' },
      select: { id: true, nazwa: true, slug: true } // Dodajemy slug
    });

    // Budujemy warunek WHERE dla produktów
    const whereCondition = {
      statusProduktu: { nazwa: 'Dostępny' }, // Zawsze tylko dostępne
    };

    if (categorySlug) {
      const category = productCategories.find(cat => cat.slug === categorySlug);
      if (category) {
        whereCondition.typProduktuId = category.id;
        selectedCategoryName = category.nazwa;
      } else {
        // Jeśli slug kategorii jest nieprawidłowy, możemy np. nie filtrować lub zwrócić błąd/pustą listę
        // Tutaj dla uproszczenia, jeśli slug jest zły, pokażemy wszystkie dostępne.
        // Można by też rzucić notFound() z next/navigation
        console.warn(`Category with slug "${categorySlug}" not found.`);
      }
    }

    productsRaw = await prisma.produkt.findMany({
      where: whereCondition,
      include: {
        typProduktu: true,
        statusProduktu: true,
        zdjecia: { where: { czyGlowne: true }, take: 1 },
        daneKsiazki: { include: { autorzy: true, gatunki: true } },
        daneAudiobooka: { include: { autorzy: true, gatunki: true } },
        daneKomiksu: { include: { scenarzysci: true, rysownicy: true, gatunki: true } },
        daneZabawki: true,
      },
      orderBy: { dataDodania: 'desc' },
      take: 20,
    });
  } catch (e) {
    console.error('Failed to fetch homepage data:', e);
    error = 'Nie udało się załadować danych. Spróbuj ponownie później.';
  }

  const products = productsRaw.length > 0 ? serializeProducts(productsRaw) : [];
  return { products, productCategories, error, currentCategorySlug: categorySlug, selectedCategoryName };
}


export default async function HomePage({ searchParams }) {
  const { products, productCategories, error, currentCategorySlug, selectedCategoryName } = await getHomePageData(searchParams);

  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Witaj w E-Kwariat!
            </h1>
            <p className="text-lg text-gray-600">
              Odkryj unikalne skarby z drugiej ręki i nie tylko.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Boczny panel kategorii */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <CategorySidebar initialCategories={productCategories} currentCategorySlug={currentCategorySlug} />
            </div>

            {/* Główna sekcja z produktami */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              <section>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  {selectedCategoryName ? `Produkty z kategorii: ${selectedCategoryName}` : "Nasza Oferta"}
                </h2>

                {error && (
                    <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">
                      {error}
                    </p>
                )}

                {!error && products.length > 0 && <ProductGrid products={products} />}

                {!error && products.length === 0 && (
                    <div className="text-center py-10 bg-white p-6 rounded-lg shadow">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <h3 className="mt-2 text-xl font-medium text-gray-900">Brak produktów</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {currentCategorySlug ? "Nie znaleziono produktów w tej kategorii." : "Wygląda na to, że nie mamy jeszcze żadnych produktów w ofercie."}
                        </p>
                         {currentCategorySlug && (
                            <div className="mt-4">
                                <Link href="/" scroll={false} className="text-indigo-600 hover:text-indigo-500 font-semibold">
                                    Pokaż wszystkie kategorie <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
  );
}