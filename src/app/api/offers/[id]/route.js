// src/app/api/offers/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// --- Zmienne pomocnicze dla ID typów produktów (takie same jak w POST) ---
const TYP_ID_KSIAZKA = 1;
const TYP_ID_AUDIOBOOK = 2;
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const produktIdInt = parseInt(id, 10);

    if (isNaN(produktIdInt)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID produktu' }, { status: 400 });
    }
    if (!data.tytul || data.cena === undefined || !data.typProduktuId || !data.statusProduktuId || !data.opisStanu) {
      return NextResponse.json({ error: 'Brakuje wymaganych pól produktu' }, { status: 400 });
    }
    const typProduktuId = parseInt(data.typProduktuId);
    const statusProduktuId = parseInt(data.statusProduktuId);
    const cena = parseFloat(data.cena);

     if (isNaN(typProduktuId) || isNaN(statusProduktuId) || isNaN(cena)) {
        return NextResponse.json({ error: 'Nieprawidłowy format danych dla cena, typProduktuId lub statusProduktuId.' }, { status: 400 });
    }

    // Sprawdź, czy produkt istnieje
    const existingProduct = await prisma.produkt.findUnique({ where: { id: produktIdInt } });
    if (!existingProduct) {
        return NextResponse.json({ error: 'Produkt nie znaleziony.' }, { status: 404 });
    }

    // Jeśli typ produktu się zmienia, usuń stare dane specyficzne (bardziej zaawansowane, na razie pomijamy dla prostoty)
    // W tej wersji zakładamy, że typ produktu się nie zmienia lub frontend zarządza usuwaniem starych danych specyficznych
    // poprzez wysłanie pustego obiektu dla poprzedniego typu.

    const produktUpdateData = {
      tytul: data.tytul, cena: cena, opisStanu: data.opisStanu, opis: data.opis,
      kodEanIsbn: data.kodEanIsbn, typProduktuId: typProduktuId, statusProduktuId: statusProduktuId,
      czyPolecany: data.czyPolecany, czyNowosc: data.czyNowosc,
    };

    let daneSpecyficzneUpdate = {};

    // Logika upsert dla każdego typu produktu
    if (typProduktuId === TYP_ID_KSIAZKA && data.daneKsiazki) {
      const dk = data.daneKsiazki;
      daneSpecyficzneUpdate.daneKsiazki = { upsert: { where: { produktId: produktIdInt },
        create: { rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null, liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null, wydawnictwo: dk.wydawnictwo, oprawa: dk.oprawa, format: dk.format, autorzy: dk.autorzyIds ? { connect: dk.autorzyIds.map(id => ({ id: parseInt(id) })) } : undefined, gatunki: dk.gatunkiIds ? { connect: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined },
        update: { rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null, liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null, wydawnictwo: dk.wydawnictwo, oprawa: dk.oprawa, format: dk.format, autorzy: dk.autorzyIds ? { set: dk.autorzyIds.map(id => ({ id: parseInt(id) })) } : { set: [] }, gatunki: dk.gatunkiIds ? { set: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : { set: [] } }
      }};
    } else if (typProduktuId === TYP_ID_AUDIOBOOK && data.daneAudiobooka) {
      const da = data.daneAudiobooka;
      daneSpecyficzneUpdate.daneAudiobooka = { upsert: { where: { produktId: produktIdInt },
        create: { lektor: da.lektor, czasTrwaniaMin: da.czasTrwaniaMin ? parseInt(da.czasTrwaniaMin) : null, formatPliku: da.formatPliku || 'MP3', rokWydania: da.rokWydania ? parseInt(da.rokWydania) : null, autorzy: da.autorzyIds ? { connect: da.autorzyIds.map(id => ({ id: parseInt(id) })) } : undefined, gatunki: da.gatunkiIds ? { connect: da.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined },
        update: { lektor: da.lektor, czasTrwaniaMin: da.czasTrwaniaMin ? parseInt(da.czasTrwaniaMin) : null, formatPliku: da.formatPliku || 'MP3', rokWydania: da.rokWydania ? parseInt(da.rokWydania) : null, autorzy: da.autorzyIds ? { set: da.autorzyIds.map(id => ({ id: parseInt(id) })) } : { set: [] }, gatunki: da.gatunkiIds ? { set: da.gatunkiIds.map(id => ({ id: parseInt(id) })) } : { set: [] } }
      }};
    } else if (typProduktuId === TYP_ID_EBOOK && data.daneEbooka) {
        const de = data.daneEbooka;
        daneSpecyficzneUpdate.daneEbooka = { upsert: { where: { produktId: produktIdInt },
            create: { formatPliku: de.formatPliku, zabezpieczenia: de.zabezpieczenia, rokWydania: de.rokWydania ? parseInt(de.rokWydania) : null },
            update: { formatPliku: de.formatPliku, zabezpieczenia: de.zabezpieczenia, rokWydania: de.rokWydania ? parseInt(de.rokWydania) : null }
        }};
    } else if (typProduktuId === TYP_ID_KOMIKS && data.daneKomiksu) {
        const dk = data.daneKomiksu;
        daneSpecyficzneUpdate.daneKomiksu = { upsert: { where: { produktId: produktIdInt },
            create: { seria: dk.seria, numerWSerii: dk.numerWSerii ? parseInt(dk.numerWSerii) : null, wydawnictwo: dk.wydawnictwo, rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null, liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null, oprawa: dk.oprawa, scenarzysci: dk.scenarzysciIds ? { connect: dk.scenarzysciIds.map(id => ({ id: parseInt(id) })) } : undefined, rysownicy: dk.rysownicyIds ? { connect: dk.rysownicyIds.map(id => ({ id: parseInt(id) })) } : undefined, gatunki: dk.gatunkiIds ? { connect: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : undefined },
            update: { seria: dk.seria, numerWSerii: dk.numerWSerii ? parseInt(dk.numerWSerii) : null, wydawnictwo: dk.wydawnictwo, rokWydania: dk.rokWydania ? parseInt(dk.rokWydania) : null, liczbaStron: dk.liczbaStron ? parseInt(dk.liczbaStron) : null, oprawa: dk.oprawa, scenarzysci: dk.scenarzysciIds ? { set: dk.scenarzysciIds.map(id => ({ id: parseInt(id) })) } : { set: [] }, rysownicy: dk.rysownicyIds ? { set: dk.rysownicyIds.map(id => ({ id: parseInt(id) })) } : { set: [] }, gatunki: dk.gatunkiIds ? { set: dk.gatunkiIds.map(id => ({ id: parseInt(id) })) } : { set: [] } }
        }};
    } else if (typProduktuId === TYP_ID_CZASOPISMO && data.daneCzasopisma) {
        const dc = data.daneCzasopisma;
        daneSpecyficzneUpdate.daneCzasopisma = { upsert: { where: { produktId: produktIdInt },
            create: { numerWydania: dc.numerWydania, wydawca: dc.wydawca, czestotliwosc: dc.czestotliwosc, dataWydania: dc.dataWydania ? new Date(dc.dataWydania) : null },
            update: { numerWydania: dc.numerWydania, wydawca: dc.wydawca, czestotliwosc: dc.czestotliwosc, dataWydania: dc.dataWydania ? new Date(dc.dataWydania) : null }
        }};
    } else if (typProduktuId === TYP_ID_MAPA_PRZEWODNIK && data.daneMapyPrzewodnika) {
        const dmp = data.daneMapyPrzewodnika;
        daneSpecyficzneUpdate.daneMapyPrzewodnika = { upsert: { where: { produktId: produktIdInt },
            create: { skala: dmp.skala, region: dmp.region, wydanie: dmp.wydanie, rokAktualizacji: dmp.rokAktualizacji ? parseInt(dmp.rokAktualizacji) : null, rodzaj: dmp.rodzaj },
            update: { skala: dmp.skala, region: dmp.region, wydanie: dmp.wydanie, rokAktualizacji: dmp.rokAktualizacji ? parseInt(dmp.rokAktualizacji) : null, rodzaj: dmp.rodzaj }
        }};
    } else if (typProduktuId === TYP_ID_PODRECZNIK && data.danePodrecznika) {
        const dp = data.danePodrecznika;
        daneSpecyficzneUpdate.danePodrecznika = { upsert: { where: { produktId: produktIdInt },
            create: { przedmiot: dp.przedmiot, poziomEdukacji: dp.poziomEdukacji, klasa: dp.klasa, rokSzkolny: dp.rokSzkolny, numerDopuszczenia: dp.numerDopuszczenia, wydawnictwo: dp.wydawnictwo },
            update: { przedmiot: dp.przedmiot, poziomEdukacji: dp.poziomEdukacji, klasa: dp.klasa, rokSzkolny: dp.rokSzkolny, numerDopuszczenia: dp.numerDopuszczenia, wydawnictwo: dp.wydawnictwo }
        }};
    } else if (typProduktuId === TYP_ID_KSIAZKA_NAUKA_JEZYKA && data.daneKsiazkiDoNaukiJezyka) {
        const dknj = data.daneKsiazkiDoNaukiJezyka;
        daneSpecyficzneUpdate.daneKsiazkiDoNaukiJezyka = { upsert: { where: { produktId: produktIdInt },
            create: { jezykDocelowy: dknj.jezykDocelowy, poziomZaawansowania: dknj.poziomZaawansowania, zawieraAudio: dknj.zawieraAudio || false, typMaterialu: dknj.typMaterialu },
            update: { jezykDocelowy: dknj.jezykDocelowy, poziomZaawansowania: dknj.poziomZaawansowania, zawieraAudio: dknj.zawieraAudio || false, typMaterialu: dknj.typMaterialu }
        }};
    } else if (typProduktuId === TYP_ID_KSIAZKA_OBCOJEZYCZNA && data.daneKsiazkiObcojezycznej) {
        const dko = data.daneKsiazkiObcojezycznej;
        daneSpecyficzneUpdate.daneKsiazkiObcojezycznej = { upsert: { where: { produktId: produktIdInt },
            create: { jezykOryginalny: dko.jezykOryginalny, tlumacz: dko.tlumacz, rokOryginalnegoWydania: dko.rokOryginalnegoWydania ? parseInt(dko.rokOryginalnegoWydania) : null },
            update: { jezykOryginalny: dko.jezykOryginalny, tlumacz: dko.tlumacz, rokOryginalnegoWydania: dko.rokOryginalnegoWydania ? parseInt(dko.rokOryginalnegoWydania) : null }
        }};
    } else if (typProduktuId === TYP_ID_ZABAWKA && data.daneZabawki) {
        const dz = data.daneZabawki;
        daneSpecyficzneUpdate.daneZabawki = { upsert: { where: { produktId: produktIdInt },
            create: { wiekDocelowyOd: dz.wiekDocelowyOd ? parseInt(dz.wiekDocelowyOd) : null, wiekDocelowyDo: dz.wiekDocelowyDo ? parseInt(dz.wiekDocelowyDo) : null, producent: dz.producent, material: dz.material, certyfikaty: dz.certyfikaty },
            update: { wiekDocelowyOd: dz.wiekDocelowyOd ? parseInt(dz.wiekDocelowyOd) : null, wiekDocelowyDo: dz.wiekDocelowyDo ? parseInt(dz.wiekDocelowyDo) : null, producent: dz.producent, material: dz.material, certyfikaty: dz.certyfikaty }
        }};
    } else if (typProduktuId === TYP_ID_OUTLET || typProduktuId === TYP_ID_POZOSTALE) {
        // Dla Outlet i Pozostałe nie aktualizujemy dodatkowych danych specyficznych,
        // chyba że zdecydujesz inaczej. Można by tu dodać logikę usuwania danych specyficznych,
        // jeśli produkt był wcześniej innego typu.
        // Na przykład, jeśli produkt był książką, a teraz jest Outletem, daneKsiazki powinny być usunięte.
        // To wymagałoby sprawdzenia `existingProduct.typProduktuId` i odpowiedniego `delete` dla `daneKsiazki`, etc.
        // Dla uproszczenia, ta logika jest pominięta.
    } else if (Object.keys(data).some(key => key.startsWith('dane'))) {
        return NextResponse.json({ error: 'Niezgodność typu produktu z przesłanymi danymi specyficznymi lub nieobsługiwany typ produktu dla danych specyficznych.' }, { status: 400 });
    }


    const updatedProduct = await prisma.produkt.update({
      where: { id: produktIdInt },
      data: {
        ...produktUpdateData,
        ...daneSpecyficzneUpdate,
        // Logika aktualizacji zdjęć (usuń stare, dodaj nowe) wymagałaby osobnej obsługi
      },
      include: {
        typProduktu: true, statusProduktu: true, zdjecia: true,
        daneKsiazki: { include: { autorzy: true, gatunki: true } },
        daneAudiobooka: { include: { autorzy: true, gatunki: true } },
        daneEbooka: true, daneKomiksu: { include: { scenarzysci: true, rysownicy: true, gatunki: true } },
        daneCzasopisma: true, daneMapyPrzewodnika: true, danePodrecznika: true,
        daneKsiazkiDoNaukiJezyka: true, daneKsiazkiObcojezycznej: true, daneZabawki: true,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Błąd podczas aktualizacji oferty:', error);
    if (error.code === 'P2025') { // Record to update not found (np. produkt lub dane specyficzne)
        return NextResponse.json({ error: 'Nie znaleziono zasobu do aktualizacji.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Nie udało się zaktualizować oferty. Sprawdź poprawność danych.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const produktIdInt = parseInt(id, 10);

    if (isNaN(produktIdInt)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID produktu' }, { status: 400 });
    }

    await prisma.produkt.delete({
      where: { id: produktIdInt },
    });

    return NextResponse.json({ message: 'Oferta została pomyślnie usunięta' });
  } catch (error) {
    console.error('Błąd podczas usuwania oferty:', error);
    if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Produkt nie znaleziony.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Nie udało się usunąć oferty' }, { status: 500 });
  }
}