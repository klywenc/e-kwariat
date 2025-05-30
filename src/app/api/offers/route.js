// src/app/api/offers/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- Zmienne pomocnicze dla ID typów produktów ---
const TYP_ID_KSIAZKA = 1;
const TYP_ID_AUDIOBOOK = 2;
// ... (reszta Twoich stałych TYP_ID_...)
const TYP_ID_EBOOK = 3;
const TYP_ID_KOMIKS = 4;
const TYP_ID_CZASOPISMO = 5;
const TYP_ID_MAPA_PRZEWODNIK = 6;
const TYP_ID_PODRECZNIK = 7;
const TYP_ID_KSIAZKA_NAUKA_JEZYKA = 8;
const TYP_ID_KSIAZKA_OBCOJEZYCZNA = 9;
const TYP_ID_ZABAWKA = 10;
const TYP_ID_OUTLET = 11;
const TYP_ID_POZOSTALE = 12;
// --- Koniec zmiennych pomocniczych ---


export async function GET() {
  try {
    const products = await prisma.produkt.findMany({
      include: {
        statusProduktu: true,
        typProduktu: true,
        zdjecia: true, // ZMIANA: Pobieramy wszystkie zdjęcia, a nie tylko główne
        // Strona edycji potrzebuje wszystkich. Strona listy może filtrować.
        // Opcjonalnie: dołącz dane specyficzne, jeśli potrzebne na liście głównej
        // daneKsiazki: { select: { rokWydania: true, autorzy: {select: {imie: true, nazwisko: true}} } },
        // ...
      },
      orderBy: { dataDodania: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Błąd podczas pobierania ofert:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać ofert' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Walidacja podstawowych pól - bez zmian
    if (!data.tytul || data.cena === undefined || !data.typProduktuId || !data.statusProduktuId || !data.opisStanu) {
      return NextResponse.json({ error: 'Brakuje wymaganych pól: tytuł, cena, typProduktuId, statusProduktuId, opisStanu' }, { status: 400 });
    }
    const typProduktuId = parseInt(data.typProduktuId);
    const statusProduktuId = parseInt(data.statusProduktuId);
    const cena = parseFloat(data.cena);

    if (isNaN(typProduktuId) || isNaN(statusProduktuId) || isNaN(cena)) {
      return NextResponse.json({ error: 'Nieprawidłowy format danych dla cena, typProduktuId lub statusProduktuId.' }, { status: 400 });
    }

    const produktData = {
      tytul: data.tytul,
      cena: cena,
      opisStanu: data.opisStanu,
      opis: data.opis,
      kodEanIsbn: data.kodEanIsbn,
      typProduktuId: typProduktuId,
      statusProduktuId: statusProduktuId,
      czyPolecany: data.czyPolecany || false,
      czyNowosc: data.czyNowosc || false,
    };

    let daneSpecyficzneCreate = {};
    // --- Twoja istniejąca logika dla danych specyficznych (bez zmian) ---
    // if (typProduktuId === TYP_ID_KSIAZKA && data.daneKsiazki) { ... }
    // ... (cała Twoja logika `else if` dla danych specyficznych) ...
    if (typProduktuId === TYP_ID_KSIAZKA && data.daneKsiazki) {
      const dk = data.daneKsiazki;
      daneSpecyficzneCreate.daneKsiazki = { create: {
          rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null,
          liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null,
          wydawnictwo: dk.wydawnictwo, oprawa: dk.oprawa, format: dk.format,
          autorzy: dk.autorzyIds ? { connect: dk.autorzyIds.map(id => ({ id: parseInt(id) })) } : undefined,
          gatunki: dk.gatunkiIds ? { connect: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined,
        }};
    } else if (typProduktuId === TYP_ID_AUDIOBOOK && data.daneAudiobooka) {
      const da = data.daneAudiobooka;
      daneSpecyficzneCreate.daneAudiobooka = { create: {
          lektor: da.lektor, czasTrwaniaMin: da.czasTrwaniaMin ? parseInt(da.czasTrwaniaMin) : null,
          formatPliku: da.formatPliku || 'MP3', rokWydania: da.rokWydania ? parseInt(da.rokWydania) : null,
          autorzy: da.autorzyIds ? { connect: da.autorzyIds.map(id => ({ id: parseInt(id) })) } : undefined,
          gatunki: da.gatunkiIds ? { connect: da.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined,
        }};
    } else if (typProduktuId === TYP_ID_EBOOK && data.daneEbooka) {
      const de = data.daneEbooka;
      daneSpecyficzneCreate.daneEbooka = { create: {
          formatPliku: de.formatPliku, zabezpieczenia: de.zabezpieczenia,
          rokWydania: de.rokWydania ? parseInt(de.rokWydania) : null,
        }};
    } else if (typProduktuId === TYP_ID_KOMIKS && data.daneKomiksu) {
      const dk = data.daneKomiksu;
      daneSpecyficzneCreate.daneKomiksu = { create: {
          seria: dk.seria, numerWSerii: dk.numerWSerii ? parseInt(dk.numerWSerii) : null,
          wydawnictwo: dk.wydawnictwo, rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null,
          liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null, oprawa: dk.oprawa,
          scenarzysci: dk.scenarzysciIds ? { connect: dk.scenarzysciIds.map(id => ({ id: parseInt(id) })) } : undefined,
          rysownicy: dk.rysownicyIds ? { connect: dk.rysownicyIds.map(id => ({ id: parseInt(id) })) } : undefined,
          gatunki: dk.gatunkiIds ? { connect: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined,
        }};
    } else if (typProduktuId === TYP_ID_CZASOPISMO && data.daneCzasopisma) {
      const dc = data.daneCzasopisma;
      daneSpecyficzneCreate.daneCzasopisma = { create: {
          numerWydania: dc.numerWydania, wydawca: dc.wydawca, czestotliwosc: dc.czestotliwosc,
          dataWydania: dc.dataWydania ? new Date(dc.dataWydania) : null,
        }};
    } else if (typProduktuId === TYP_ID_MAPA_PRZEWODNIK && data.daneMapyPrzewodnika) {
      const dmp = data.daneMapyPrzewodnika;
      daneSpecyficzneCreate.daneMapyPrzewodnika = { create: {
          skala: dmp.skala, region: dmp.region, wydanie: dmp.wydanie,
          rokAktualizacji: dmp.rokAktualizacji ? parseInt(dmp.rokAktualizacji) : null, rodzaj: dmp.rodzaj,
        }};
    } else if (typProduktuId === TYP_ID_PODRECZNIK && data.danePodrecznika) {
      const dp = data.danePodrecznika;
      daneSpecyficzneCreate.danePodrecznika = { create: {
          przedmiot: dp.przedmiot, poziomEdukacji: dp.poziomEdukacji, klasa: dp.klasa,
          rokSzkolny: dp.rokSzkolny, numerDopuszczenia: dp.numerDopuszczenia, wydawnictwo: dp.wydawnictwo,
        }};
    } else if (typProduktuId === TYP_ID_KSIAZKA_NAUKA_JEZYKA && data.daneKsiazkiDoNaukiJezyka) {
      const dknj = data.daneKsiazkiDoNaukiJezyka;
      daneSpecyficzneCreate.daneKsiazkiDoNaukiJezyka = { create: {
          jezykDocelowy: dknj.jezykDocelowy, poziomZaawansowania: dknj.poziomZaawansowania,
          zawieraAudio: dknj.zawieraAudio || false, typMaterialu: dknj.typMaterialu,
        }};
    } else if (typProduktuId === TYP_ID_KSIAZKA_OBCOJEZYCZNA && data.daneKsiazkiObcojezycznej) {
      const dko = data.daneKsiazkiObcojezycznej;
      daneSpecyficzneCreate.daneKsiazkiObcojezycznej = { create: {
          jezykOryginalny: dko.jezykOryginalny, tlumacz: dko.tlumacz,
          rokOryginalnegoWydania: dko.rokOryginalnegoWydania ? parseInt(dko.rokOryginalnegoWydania) : null,
        }};
    } else if (typProduktuId === TYP_ID_ZABAWKA && data.daneZabawki) {
      const dz = data.daneZabawki;
      daneSpecyficzneCreate.daneZabawki = { create: {
          wiekDocelowyOd: dz.wiekDocelowyOd ? parseInt(dz.wiekDocelowyOd) : null,
          wiekDocelowyDo: dz.wiekDocelowyDo ? parseInt(dz.wiekDocelowyDo) : null,
          producent: dz.producent, material: dz.material, certyfikaty: dz.certyfikaty,
        }};
    } else if (typProduktuId === TYP_ID_OUTLET || typProduktuId === TYP_ID_POZOSTALE) {
      // Brak specyficznych danych
    } else if (Object.keys(data).some(key => key.startsWith('dane'))) {
      return NextResponse.json({ error: 'Niezgodność typu produktu z przesłanymi danymi specyficznymi lub nieobsługiwany typ produktu dla danych specyficznych.' }, { status: 400 });
    }
    // --- Koniec logiki dla danych specyficznych ---

    const newProduct = await prisma.produkt.create({
      data: {
        ...produktData,
        ...daneSpecyficzneCreate,
        // ZMIANA: Logika tworzenia zdjęć
        // Zakładamy, że frontend wysyła `data.zdjecia` jako tablicę obiektów:
        // [{ url: '...', opisAlt: '...', czyGlowne: true/false }, ...]
        zdjecia: data.zdjecia && Array.isArray(data.zdjecia) && data.zdjecia.length > 0 ? {
          create: data.zdjecia.map(img => ({
            url: img.url,
            opisAlt: img.opisAlt || '', // Domyślny opisAlt jeśli brak
            czyGlowne: img.czyGlowne || false,
          })),
        } : undefined,
      },
      include: { // Twoja istniejąca sekcja include - jest OK
        typProduktu: true, statusProduktu: true, zdjecia: true,
        daneKsiazki: { include: { autorzy: true, gatunki: true } },
        daneAudiobooka: { include: { autorzy: true, gatunki: true } },
        daneEbooka: true, daneKomiksu: { include: { scenarzysci: true, rysownicy: true, gatunki: true } },
        daneCzasopisma: true, daneMapyPrzewodnika: true, danePodrecznika: true,
        daneKsiazkiDoNaukiJezyka: true, daneKsiazkiObcojezycznej: true, daneZabawki: true,
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas tworzenia oferty:', error);
    // Twoja istniejąca obsługa błędów - jest OK
    if (error.code === 'P2002' && error.meta?.target?.includes('kodEanIsbn')) {
      return NextResponse.json({ error: 'Produkt z takim kodem EAN/ISBN już istnieje.' }, { status: 409 });
    }
    if (error.code === 'P2003') {
      const fieldName = error.meta?.field_name;
      if (fieldName?.includes('typProduktuId')) return NextResponse.json({ error: 'Wybrany typ produktu jest nieprawidłowy.' }, { status: 400 });
      if (fieldName?.includes('statusProduktuId')) return NextResponse.json({ error: 'Wybrany status produktu jest nieprawidłowy.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Nie udało się utworzyć oferty. Sprawdź poprawność danych.' }, { status: 500 });
  }
}