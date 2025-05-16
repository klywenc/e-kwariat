// app/product/[id]/page.js
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/app/components/AddToCartButton';
// Rozważ stworzenie osobnego komponentu klienckiego dla przycisku "Dodaj do koszyka"
// import AddToCartButton from '@/components/AddToCartButton';

// Funkcja pomocnicza do serializacji produktu (i jego zagnieżdżonych danych)
const serializeProductDetails = (product) => {
    if (!product) return null;

    const serialized = {
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
        zdjecia: product.zdjecia.map(zdjecie => ({ ...zdjecie })),
        typProduktu: { ...product.typProduktu },
        statusProduktu: { ...product.statusProduktu },
    };
    return serialized;
};

async function getProductDetails(productId) {
    const id = parseInt(productId, 10);
    if (isNaN(id)) notFound();

    try {
        const product = await prisma.produkt.findUnique({
            where: { id: id },
            include: {
                typProduktu: true,
                statusProduktu: true,
                zdjecia: true,
                daneKsiazki: { include: { autorzy: true, gatunki: true } },
                daneAudiobooka: { include: { autorzy: true, gatunki: true } },
                daneEbooka: true,
                daneKomiksu: { include: { scenarzysci: true, rysownicy: true, gatunki: true } },
                daneCzasopisma: true,
                daneMapyPrzewodnika: true,
                danePodrecznika: true, // Można dodać include dla autorów, jeśli DanePodrecznika mają taką relację
                daneKsiazkiDoNaukiJezyka: true,
                daneKsiazkiObcojezycznej: { include: { /* np. autorzy oryginału, jeśli dodasz taką relację */ } },
                daneZabawki: true,
            },
        });
        if (!product) notFound();
        return serializeProductDetails(product);
    } catch (error) {
        console.error("Błąd podczas pobierania danych produktu:", error);
        notFound();
    }
}

export default async function ProductDetailsPage({ params }) {
    const product = await getProductDetails(params.id);
    if (!product) notFound();

    const formattedPrice = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(product.cena);
    const mainImage = product.zdjecia?.find(z => z.czyGlowne)?.url || product.zdjecia?.[0]?.url || "/images/cover.png";
    const mainImageAlt = product.zdjecia?.find(z => z.czyGlowne)?.opisAlt || product.zdjecia?.[0]?.opisAlt || `Okładka produktu ${product.tytul}`;
    const thumbnails = product.zdjecia?.filter(z => z.url !== mainImage) || [];
    const isAvailable = product.statusProduktu?.nazwa === 'Dostępny';

    let productSpecificDetails = [];

    // --- Logika wyświetlania szczegółów dla każdego typu produktu ---
    if (product.typProduktu?.nazwa === 'Książka' && product.daneKsiazki) {
        const { autorzy, gatunki, rokWydania, wydawnictwo, oprawa, liczbaStron, format } = product.daneKsiazki;
        const authorsDisplay = autorzy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ') || 'Brak informacji';
        productSpecificDetails.push({ label: 'Autorzy', value: authorsDisplay });
        if (rokWydania) productSpecificDetails.push({ label: 'Rok wydania', value: rokWydania });
        if (wydawnictwo) productSpecificDetails.push({ label: 'Wydawnictwo', value: wydawnictwo });
        if (oprawa) productSpecificDetails.push({ label: 'Oprawa', value: oprawa });
        if (liczbaStron) productSpecificDetails.push({ label: 'Liczba stron', value: liczbaStron });
        if (format) productSpecificDetails.push({ label: 'Format', value: format });
        if (gatunki?.length > 0) productSpecificDetails.push({ label: 'Gatunki', value: gatunki.map(g => g.nazwa).join(', ') });
    } else if (product.typProduktu?.nazwa === 'Audiobook MP3' && product.daneAudiobooka) {
        const { lektor, czasTrwaniaMin, autorzy, gatunki, rokWydania, formatPliku } = product.daneAudiobooka;
        const authorsDisplay = autorzy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ') || 'Brak informacji';
        if (lektor) productSpecificDetails.push({ label: 'Lektor', value: lektor });
        if (authorsDisplay) productSpecificDetails.push({ label: 'Autor oryginału', value: authorsDisplay });
        if (rokWydania) productSpecificDetails.push({ label: 'Rok wydania', value: rokWydania });
        if (czasTrwaniaMin) productSpecificDetails.push({ label: 'Czas trwania', value: `${Math.floor(czasTrwaniaMin / 60)}h ${czasTrwaniaMin % 60}min` });
        if (formatPliku) productSpecificDetails.push({ label: 'Format', value: formatPliku });
        if (gatunki?.length > 0) productSpecificDetails.push({ label: 'Gatunki', value: gatunki.map(g => g.nazwa).join(', ') });
    } else if (product.typProduktu?.nazwa === 'Ebook' && product.daneEbooka) {
        const { formatPliku, rokWydania, zabezpieczenia } = product.daneEbooka;
        if (formatPliku) productSpecificDetails.push({ label: 'Format pliku', value: formatPliku });
        if (rokWydania) productSpecificDetails.push({ label: 'Rok wydania', value: rokWydania });
        if (zabezpieczenia) productSpecificDetails.push({ label: 'Zabezpieczenia', value: zabezpieczenia });
        // Można dodać autorów/gatunki, jeśli Ebook ma te relacje lub dziedziczy z DaneKsiazki
    } else if (product.typProduktu?.nazwa === 'Komiks' && product.daneKomiksu) {
        const { scenarzysci, rysownicy, seria, wydawnictwo, rokWydania, oprawa, liczbaStron } = product.daneKomiksu;
        const scenarzysciDisplay = scenarzysci?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
        const rysownicyDisplay = rysownicy?.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
        if (scenarzysciDisplay) productSpecificDetails.push({ label: 'Scenariusz', value: scenarzysciDisplay });
        if (rysownicyDisplay) productSpecificDetails.push({ label: 'Rysunki', value: rysownicyDisplay });
        if (seria) productSpecificDetails.push({ label: 'Seria', value: seria });
        if (rokWydania) productSpecificDetails.push({ label: 'Rok wydania', value: rokWydania });
        if (wydawnictwo) productSpecificDetails.push({ label: 'Wydawnictwo', value: wydawnictwo });
        if (oprawa) productSpecificDetails.push({ label: 'Oprawa', value: oprawa });
        if (liczbaStron) productSpecificDetails.push({ label: 'Liczba stron', value: liczbaStron });
    } else if (product.typProduktu?.nazwa === 'Czasopismo' && product.daneCzasopisma) {
        const { numerWydania, wydawca, dataWydania, czestotliwosc } = product.daneCzasopisma;
        if (numerWydania) productSpecificDetails.push({ label: 'Numer', value: numerWydania });
        if (wydawca) productSpecificDetails.push({ label: 'Wydawca', value: wydawca });
        if (dataWydania) productSpecificDetails.push({ label: 'Data wydania', value: new Date(dataWydania).toLocaleDateString('pl-PL') });
        if (czestotliwosc) productSpecificDetails.push({ label: 'Częstotliwość', value: czestotliwosc });
    } else if (product.typProduktu?.nazwa === 'Mapa/Przewodnik' && product.daneMapyPrzewodnika) {
        const { skala, region, rodzaj, rokAktualizacji, wydanie } = product.daneMapyPrzewodnika;
        if (rodzaj) productSpecificDetails.push({ label: 'Rodzaj', value: rodzaj });
        if (region) productSpecificDetails.push({ label: 'Region', value: region });
        if (skala) productSpecificDetails.push({ label: 'Skala', value: skala });
        if (rokAktualizacji) productSpecificDetails.push({ label: 'Rok aktualizacji', value: rokAktualizacji });
        if (wydanie) productSpecificDetails.push({ label: 'Wydanie', value: wydanie });
    } else if (product.typProduktu?.nazwa === 'Podręcznik' && product.danePodrecznika) {
        const { przedmiot, poziomEdukacji, klasa, rokSzkolny, wydawnictwo, numerDopuszczenia } = product.danePodrecznika;
        productSpecificDetails.push({ label: 'Przedmiot', value: przedmiot });
        if (poziomEdukacji) productSpecificDetails.push({ label: 'Poziom edukacji', value: `${poziomEdukacji}${klasa ? ` (kl. ${klasa})` : ''}` });
        if (rokSzkolny) productSpecificDetails.push({ label: 'Rok szkolny', value: rokSzkolny });
        if (wydawnictwo) productSpecificDetails.push({ label: 'Wydawnictwo', value: wydawnictwo });
        if (numerDopuszczenia) productSpecificDetails.push({ label: 'Nr dopuszczenia', value: numerDopuszczenia });
    } else if (product.typProduktu?.nazwa === 'Książka do nauki języka' && product.daneKsiazkiDoNaukiJezyka) {
        const { jezykDocelowy, poziomZaawansowania, typMaterialu, zawieraAudio } = product.daneKsiazkiDoNaukiJezyka;
        productSpecificDetails.push({ label: 'Język docelowy', value: jezykDocelowy });
        if (poziomZaawansowania) productSpecificDetails.push({ label: 'Poziom', value: poziomZaawansowania });
        if (typMaterialu) productSpecificDetails.push({ label: 'Typ materiału', value: typMaterialu });
        productSpecificDetails.push({ label: 'Zawiera audio', value: zawieraAudio ? 'Tak' : 'Nie' });
    } else if (product.typProduktu?.nazwa === 'Książka obcojęzyczna' && product.daneKsiazkiObcojezycznej) {
        const { jezykOryginalny, tlumacz, rokOryginalnegoWydania } = product.daneKsiazkiObcojezycznej;
        productSpecificDetails.push({ label: 'Język oryginalny', value: jezykOryginalny });
        if (tlumacz) productSpecificDetails.push({ label: 'Tłumacz', value: tlumacz });
        if (rokOryginalnegoWydania) productSpecificDetails.push({ label: 'Rok oryg. wydania', value: rokOryginalnegoWydania });
        // Można dodać autorów/gatunki, jeśli są dziedziczone lub powiązane
        if (product.daneKsiazki?.autorzy?.length > 0) { // Przykład, jeśli książka obcojęzyczna to też 'Książka'
            const authorsDisplay = product.daneKsiazki.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
            productSpecificDetails.push({ label: 'Autorzy', value: authorsDisplay });
        }
    } else if (product.typProduktu?.nazwa === 'Zabawka' && product.daneZabawki) {
        const { wiekDocelowyOd, wiekDocelowyDo, producent, material, certyfikaty } = product.daneZabawki;
        if (producent) productSpecificDetails.push({ label: 'Producent', value: producent });
        if (wiekDocelowyOd !== null) productSpecificDetails.push({ label: 'Wiek', value: `od ${wiekDocelowyOd}${wiekDocelowyDo ? ` do ${wiekDocelowyDo}` : ''} lat` });
        if (material) productSpecificDetails.push({ label: 'Materiał', value: material });
        if (certyfikaty) productSpecificDetails.push({ label: 'Certyfikaty', value: certyfikaty });
    } else if (product.typProduktu?.nazwa === 'Outlet') {
        productSpecificDetails.push({ label: 'Typ oferty', value: 'Produkt outletowy' });
        // Opis stanu jest już wyświetlany osobno
        // Można dodać więcej informacji, jeśli model DaneOutletu by istniał
    } else if (product.typProduktu?.nazwa === 'Pozostałe') {
        // Dla "Pozostałe" można wyświetlić ogólny opis, jeśli nie ma innych specyficznych danych
        // Opis produktu jest już wyświetlany osobno
    }

    return (
        <main className="flex-grow py-8 md:py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        <div>
                            <div className="relative w-full h-80 xs:h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] bg-gray-100 rounded-md overflow-hidden border">
                                <Image
                                    src={mainImage}
                                    alt={mainImageAlt}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                    sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
                                />
                            </div>
                            {thumbnails.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {thumbnails.map((thumb) => (
                                        <div key={thumb.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden border hover:border-indigo-500 cursor-pointer">
                                            <Image src={thumb.url} alt={thumb.opisAlt || `Miniatura ${product.tytul}`} fill style={{ objectFit: 'cover' }} sizes="15vw" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-indigo-600 font-semibold mb-1 uppercase tracking-wider">{product.typProduktu?.nazwa || 'Produkt'}</span>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                {product.tytul}
                            </h1>

                            {product.statusProduktu && (
                                <p className={`text-xs font-bold mb-4 px-2.5 py-1 inline-block rounded-full
                                    ${isAvailable ? 'bg-green-100 text-green-800' :
                                        product.statusProduktu.nazwa === 'Zarezerwowany' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'}`}>
                                    {product.statusProduktu.nazwa}
                                </p>
                            )}

                            <div className="mb-6">
                                <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{formattedPrice}</span>
                            </div>

                            {product.opis && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Opis produktu</h2>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.opis}</p>
                                </div>
                            )}

                            {product.opisStanu && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Stan produktu</h2>
                                    <p className="text-gray-600 text-sm whitespace-pre-line">{product.opisStanu}</p>
                                </div>
                            )}

                            {productSpecificDetails.length > 0 && (
                                <div className="mb-6 border-t border-gray-200 pt-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Szczegóły</h2>
                                    <dl className="space-y-1.5 text-sm text-gray-700">
                                        {productSpecificDetails.map(detail => (
                                            <div key={detail.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 items-baseline">
                                                <dt className="font-medium text-gray-500 sm:col-span-1">{detail.label}:</dt>
                                                <dd className="sm:col-span-2">{typeof detail.value === 'boolean' ? (detail.value ? 'Tak' : 'Nie') : detail.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            )}

                            <p className="text-xs text-gray-400 mt-4">
                                {product.kodEanIsbn && <>Kod: {product.kodEanIsbn}<br /></>}
                                Data dodania: {new Date(product.dataDodania).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>

                            <div className="mt-auto pt-8">
                                <div className="mt-auto pt-8">
                                    <AddToCartButton
                                        productId={product.id}
                                        productName={product.tytul}
                                        isAvailable={isAvailable}
                                        currentStatusName={product.statusProduktu?.nazwa}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export async function generateMetadata({ params }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return { title: 'Nie znaleziono produktu' };

    const product = await prisma.produkt.findUnique({
        where: { id: id },
        include: {
            zdjecia: { where: { czyGlowne: true }, take: 1 },
            daneKsiazki: { include: { autorzy: true } },
            typProduktu: true,
        },
    });

    if (!product) return { title: 'Nie znaleziono produktu' };

    let description = product.opis?.substring(0, 155) || product.opisStanu?.substring(0, 155) || `Zobacz ${product.tytul} w E-Kwariat.`;
    if (description.length === 155) description += "...";

    if (product.typProduktu?.nazwa === 'Książka' && product.daneKsiazki?.autorzy?.length > 0) {
        const authorsString = product.daneKsiazki.autorzy.map(a => `${a.imie || ''} ${a.nazwisko}`.trim()).join(', ');
        description = `Autor: ${authorsString}. ${description}`;
        if (description.length > 155) description = description.substring(0, 152) + "...";
    }

    const imageUrl = product.zdjecia?.[0]?.url || '/images/cover.png';

    return {
        title: `${product.tytul} - ${product.typProduktu?.nazwa || 'Produkt'} | E-Kwariat`,
        description: description,
        openGraph: {
            title: `${product.tytul} - E-Kwariat`,
            description: product.opis?.substring(0, 100) || description,
            images: [{ url: imageUrl, width: 800, height: 600, alt: `Okładka ${product.tytul}` }],
            type: 'article',
        },
    };
}