// prisma/seed.js
const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Statusy Produktu (zamiast StatusKsiazki) ---
  const statusProdDostepny = await prisma.statusProduktu.upsert({
    where: { nazwa: 'Dostępny' },
    update: {},
    create: { nazwa: 'Dostępny' },
  });

  const statusProdSprzedany = await prisma.statusProduktu.upsert({
    where: { nazwa: 'Wyprzedany' }, // Zmieniona nazwa dla ogólności
    update: {},
    create: { nazwa: 'Wyprzedany' },
  });

  const statusProdRezerwacja = await prisma.statusProduktu.upsert({
    where: { nazwa: 'Zarezerwowany' },
    update: {},
    create: { nazwa: 'Zarezerwowany' },
  });
  console.log('Created product statuses.');

  // --- Typy Produktów ---
const typKsiazka = await prisma.typProduktu.upsert({
  where: { nazwa: 'Książka' }, update: {},
  create: { nazwa: 'Książka', slug: 'ksiazki', opis: 'Tradycyjne książki drukowane.' },
});
const typAudiobook = await prisma.typProduktu.upsert({
  where: { nazwa: 'Audiobook MP3' }, update: {},
  create: { nazwa: 'Audiobook MP3', slug: 'audiobooki-mp3', opis: 'Książki do słuchania w formacie MP3.' },
});
const typEbook = await prisma.typProduktu.upsert({
  where: { nazwa: 'Ebook' }, update: {},
  create: { nazwa: 'Ebook', slug: 'ebooki', opis: 'Książki w formacie elektronicznym.' },
});
const typKomiks = await prisma.typProduktu.upsert({
  where: { nazwa: 'Komiks' }, update: {},
  create: { nazwa: 'Komiks', slug: 'komiksy', opis: 'Opowieści obrazkowe.' },
});
const typCzasopismo = await prisma.typProduktu.upsert({ // <--- UPEWNIJ SIĘ, ŻE MASZ TEN WPIS
  where: { nazwa: 'Czasopismo' }, update: {},
  create: { nazwa: 'Czasopismo', slug: 'czasopisma', opis: 'Magazyny i periodyki.' },
});
const typMapaPrzewodnik = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Mapa/Przewodnik' }, update: {},
  create: { nazwa: 'Mapa/Przewodnik', slug: 'mapy-przewodniki', opis: 'Mapy, atlasy i przewodniki turystyczne.' },
});
const typPodrecznik = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Podręcznik' }, update: {},
  create: { nazwa: 'Podręcznik', slug: 'podreczniki', opis: 'Podręczniki szkolne i akademickie.' },
});
const typKsiazkaNaukaJezyka = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Książka do nauki języka' }, update: {},
  create: { nazwa: 'Książka do nauki języka', slug: 'nauka-jezykow', opis: 'Materiały do nauki języków obcych.' },
});
const typKsiazkaObcojezyczna = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Książka obcojęzyczna' }, update: {},
  create: { nazwa: 'Książka obcojęzyczna', slug: 'ksiazki-obcojezyczne', opis: 'Książki w językach innych niż polski.' },
});
const typZabawka = await prisma.typProduktu.upsert({
  where: { nazwa: 'Zabawka' }, update: {},
  create: { nazwa: 'Zabawka', slug: 'zabawki', opis: 'Zabawki dla dzieci i nie tylko.' },
});
const typOutlet = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Outlet' }, update: {},
  create: { nazwa: 'Outlet', slug: 'outlet', opis: 'Produkty w obniżonych cenach, np. z drobnymi wadami lub końcówki serii.' },
});
const typPozostale = await prisma.typProduktu.upsert({ // <--- I TEN
  where: { nazwa: 'Pozostałe' }, update: {},
  create: { nazwa: 'Pozostałe', slug: 'pozostale', opis: 'Inne produkty niepasujące do głównych kategorii.' },
});
console.log('Created product types.');


  // --- Statusy Zamówień ---
  const statusZamNowe = await prisma.statusZamowienia.upsert({
    where: { nazwa: 'Nowe' },
    update: {},
    create: { nazwa: 'Nowe', opis: 'Zamówienie zostało złożone.' },
  });
  console.log('Created order statuses.');

  // --- Autorzy ---
  const autorSapkowski = await prisma.autor.upsert({
    where: { id: 1 }, 
    update: {},
    create: { id: 1, imie: 'Andrzej', nazwisko: 'Sapkowski', opis: 'Polski pisarz fantasy.' },
  });
  const autorLem = await prisma.autor.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, imie: 'Stanisław', nazwisko: 'Lem', opis: 'Polski pisarz science fiction, filozof.' },
  });
  const autorTolkien = await prisma.autor.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, imie: 'J.R.R.', nazwisko: 'Tolkien', opis: 'Angielski pisarz.' },
  });
  const autorHerbert = await prisma.autor.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, imie: 'Frank', nazwisko: 'Herbert', opis: 'Amerykański pisarz science fiction.' },
  });
  const autorLewis = await prisma.autor.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, imie: 'C.S.', nazwisko: 'Lewis', opis: 'Brytyjski pisarz.' },
  });
  console.log(`Created authors.`);

  // --- Gatunki ---
  const gatunekFantasy = await prisma.gatunek.upsert({
    where: { nazwa: 'Fantasy' },
    update: {},
    create: { nazwa: 'Fantasy', opis: 'Elementy magii i nadprzyrodzone.' },
  });
  const gatunekSciFi = await prisma.gatunek.upsert({
    where: { nazwa: 'Science Fiction' },
    update: {},
    create: { nazwa: 'Science Fiction', opis: 'Nauka i technologia przyszłości.' },
  });
  const gatunekPrzygodowa = await prisma.gatunek.upsert({
    where: { nazwa: 'Przygodowa' },
    update: {},
    create: { nazwa: 'Przygodowa', opis: 'Powieści pełne akcji i przygód.' },
  });
  const gatunekDlaDzieci = await prisma.gatunek.upsert({
    where: { nazwa: 'Dla dzieci' },
    update: {},
    create: { nazwa: 'Dla dzieci', opis: 'Literatura dziecięca.' },
  });
  console.log(`Created genres.`);

  // --- Produkty (zamiast Ksiazki) ---

  // Przykład 1: Książka "Wiedźmin"
  await prisma.produkt.upsert({
    where: { id: 1 }, // Używamy ID dla produktu dla spójności seeda
    update: {
      tytul: 'Wiedźmin: Ostatnie życzenie',
      cena: 35.99,
      opisStanu: 'Bardzo dobry, lekkie ślady użytkowania na okładce.',
      statusProduktuId: statusProdDostepny.id,
      typProduktuId: typKsiazka.id,

      daneKsiazki: {
        update: {
            rokWydania: 1993,
            liczbaStron: 288,
            wydawnictwo: 'superNOWA',
            oprawa: 'Miękka',
        }
      }
    },
    create: {
      tytul: 'Wiedźmin: Ostatnie życzenie',
      cena: 35.99,
      opisStanu: 'Bardzo dobry, lekkie ślady użytkowania na okładce.',
      opis: 'Zbiór opowiadań fantasy Andrzeja Sapkowskiego, pierwszy tom sagi o wiedźminie Geralcie z Rivii.',
      kodEanIsbn: '9788375780635', // Przykładowy ISBN
      statusProduktu: { connect: { id: statusProdDostepny.id } },
      typProduktu: { connect: { id: typKsiazka.id } },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Wiedźmina', czyGlowne: true },
        ]
      },
      daneKsiazki: { // Tworzenie powiązanych danych specyficznych dla książki
        create: {
          rokWydania: 1993,
          liczbaStron: 288,
          wydawnictwo: 'superNOWA',
          oprawa: 'Miękka',
          autorzy: { connect: [{ id: autorSapkowski.id }] },
          gatunki: { connect: [{ id: gatunekFantasy.id }] },
        }
      }
    },
  });

  // Przykład 2: Książka "Solaris"
  await prisma.produkt.upsert({
    where: { id: 2 },
    update: {
        tytul: 'Solaris',
        cena: 29.50,
        opisStanu: 'Dobry, lekkie zagięcia okładki, pożółkłe strony.',
        statusProduktuId: statusProdDostepny.id,
        typProduktuId: typKsiazka.id,
        daneKsiazki: {
            update: {
                rokWydania: 1961,
                liczbaStron: 208,
                wydawnictwo: 'Wydawnictwo Literackie',
            }
        }
    },
    create: {
      tytul: 'Solaris',
      cena: 29.50,
      opisStanu: 'Dobry, lekkie zagięcia okładki, pożółkłe strony.',
      opis: 'Powieść science fiction Stanisława Lema.',
      kodEanIsbn: '9788308068619',
      statusProduktu: { connect: { id: statusProdDostepny.id } },
      typProduktu: { connect: { id: typKsiazka.id } },
      zdjecia: { create: [{ url: '/images/cover.png', opisAlt: 'Okładka Solaris', czyGlowne: true }] },
      daneKsiazki: {
        create: {
          rokWydania: 1961,
          liczbaStron: 208,
          wydawnictwo: 'Wydawnictwo Literackie',
          autorzy: { connect: [{ id: autorLem.id }] },
          gatunki: { connect: [{ id: gatunekSciFi.id }] },
        }
      }
    },
  });

  // Przykład 3: Audiobook "Hobbit" (fikcyjny)
  await prisma.produkt.upsert({
    where: { id: 3 },
    update: {
        tytul: 'Hobbit - Audiobook',
        cena: 49.90,
        opisStanu: 'Nowy',
        statusProduktuId: statusProdDostepny.id,
        typProduktuId: typAudiobook.id,
        daneAudiobooka: {
            update: {
                lektor: 'Krzysztof Gosztyła',
                czasTrwaniaMin: 600,
                rokWydania: 2022,
            }
        }
    },
    create: {
      tytul: 'Hobbit - Audiobook',
      cena: 49.90,
      opisStanu: 'Nowy',
      opis: 'Audiobook na podstawie powieści J.R.R. Tolkiena.',
      statusProduktu: { connect: { id: statusProdDostepny.id } },
      typProduktu: { connect: { id: typAudiobook.id } },
      zdjecia: { create: [{ url: '/images/cover.png', opisAlt: 'Okładka audiobooka Hobbit', czyGlowne: true }] },
      daneAudiobooka: {
        create: {
          lektor: 'Krzysztof Gosztyła',
          czasTrwaniaMin: 600, // 10 godzin
          formatPliku: 'MP3',
          rokWydania: 2022,
          autorzy: { connect: [{ id: autorTolkien.id }] }, // Autor oryginalnego dzieła
          gatunki: { connect: [{ id: gatunekFantasy.id }, { id: gatunekPrzygodowa.id }] },
        }
      }
    },
  });

  // Przykład 4: Zabawka (fikcyjna)
  await prisma.produkt.upsert({
    where: { id: 4 },
    update: {
        tytul: 'Pluszowy Smok',
        cena: 79.00,
        opisStanu: 'Nowy',
        statusProduktuId: statusProdDostepny.id,
        typProduktuId: typZabawka.id,
        daneZabawki: {
            update: {
                wiekDocelowyOd: 3,
                producent: 'Smocze Zabawki Co.',
            }
        }
    },
    create: {
      tytul: 'Pluszowy Smok',
      cena: 79.00,
      opisStanu: 'Nowy',
      opis: 'Miękki i przyjazny pluszowy smok dla dzieci.',
      kodEanIsbn: '5901234567890', // Przykładowy EAN
      statusProduktu: { connect: { id: statusProdDostepny.id } },
      typProduktu: { connect: { id: typZabawka.id } },
      zdjecia: { create: [{ url: '/images/cover.png', opisAlt: 'Pluszowy smok', czyGlowne: true }] },
      daneZabawki: {
        create: {
          wiekDocelowyOd: 3, // Wiek w latach
          producent: 'Smocze Zabawki Co.',
          material: 'Plusz, poliester',
          certyfikaty: 'CE',
        }
      }
    },
  });


  console.log(`Created/updated products.`);

  // --- Użytkownicy ---
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { nazwisko: 'Kowalski', name: 'Jan', role: Role.USER, czyAktywny: true },
    create: {
      email: 'test@example.com',
      password: 'password123_seed', // PAMIĘTAJ: Hashuj!
      nazwisko: 'Kowalski',
      name: 'Jan',
      role: Role.USER,
      czyAktywny: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { nazwisko: 'Admin', name: 'Super', role: Role.ADMIN, czyAktywny: true },
    create: {
      email: 'admin@example.com',
      password: 'adminpassword_seed', // PAMIĘTAJ: Hashuj!
      nazwisko: 'Admin',
      name: 'Super',
      role: Role.ADMIN,
      czyAktywny: true,
    },
  });
  console.log(`Created/updated users: ${user1.email}, ${adminUser.email}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });