// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { Decimal } = require('@prisma/client/runtime/library');
// Jeśli chcesz hashować hasła (zalecane nawet dla seedera, jeśli planujesz logowanie)
// const bcrypt = require('bcrypt');
// const saltRounds = 10; // Koszt hashowania

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Czyszczenie istniejących danych (w odpowiedniej kolejności) ---
  console.log('Cleaning existing data...');
  // Najpierw usuń rekordy, które mają klucze obce do innych tabel
  await prisma.zdjecieKsiazki.deleteMany();
  await prisma.pozycjaZamowienia.deleteMany();
  await prisma.platnosc.deleteMany();
  await prisma.rezerwacja.deleteMany();
  // Zgłoszenia mogą być powiązane z książkami i użytkownikami
  await prisma.zgloszenieKsiazki.deleteMany();
  // Książki mają wiele powiązań, usuń przed autorami/gatunkami jeśli czyścisz też je
  await prisma.ksiazka.deleteMany(); // Usunie też powiązania M:N z Autor i Gatunek
  // Zamówienia zależą od użytkowników, adresów, metod dostawy, statusów
  await prisma.zamowienie.deleteMany();
  // Adresy zależą od użytkowników
  await prisma.adres.deleteMany();
  // Użytkownicy zależą od ról
  await prisma.uzytkownik.deleteMany();
  // Dane podstawowe/słownikowe
  await prisma.rola.deleteMany();
  await prisma.statusKsiazki.deleteMany();
  await prisma.gatunek.deleteMany();
  await prisma.autor.deleteMany();
  await prisma.statusZamowienia.deleteMany();
  await prisma.metodaDostawy.deleteMany();
  await prisma.metodaPlatnosci.deleteMany();
  console.log('Existing data cleaned.');

  // --- Tworzenie danych podstawowych ---
  console.log('Creating base data...');

  // Role
  const rolaUser = await prisma.rola.create({ data: { nazwa: 'Uzytkownik' } });
  const rolaAdmin = await prisma.rola.create({ data: { nazwa: 'Admin' } });

  // Statusy książek
  const statusDostepna = await prisma.statusKsiazki.create({ data: { nazwa: 'Dostępna' } });
  const statusZarezerwowana = await prisma.statusKsiazki.create({ data: { nazwa: 'Zarezerwowana' } });
  const statusSprzedana = await prisma.statusKsiazki.create({ data: { nazwa: 'Sprzedana' } });

  // Gatunki
  const gatunekFantastyka = await prisma.gatunek.create({ data: { nazwa: 'Fantastyka', opis: 'Elementy magiczne, światy wymyślone.' } });
  const gatunekKryminal = await prisma.gatunek.create({ data: { nazwa: 'Kryminał', opis: 'Zagadki, zbrodnie, śledztwa.' } });
  const gatunekNaukowa = await prisma.gatunek.create({ data: { nazwa: 'Naukowa', opis: 'Publikacje oparte na badaniach.' } });
  const gatunekRomans = await prisma.gatunek.create({ data: { nazwa: 'Romans', opis: 'Historie miłosne.' } });
  const gatunekPoradnik = await prisma.gatunek.create({ data: { nazwa: 'Poradnik', opis: 'Praktyczne wskazówki.' } });


  // Autorzy
  const autorSapkowski = await prisma.autor.create({ data: { imie: 'Andrzej', nazwisko: 'Sapkowski' } });
  const autorKing = await prisma.autor.create({ data: { imie: 'Stephen', nazwisko: 'King' } });
  const autorRowling = await prisma.autor.create({ data: { imie: 'J.K.', nazwisko: 'Rowling' } });
  const autorTolkien = await prisma.autor.create({ data: { imie: 'J.R.R.', nazwisko: 'Tolkien' } });
  const autorMróz = await prisma.autor.create({ data: { imie: 'Remigiusz', nazwisko: 'Mróz' } });
  const autorNieznany = await prisma.autor.create({ data: { nazwisko: 'Autor Nieznany' } }); // Dla zgłoszeń

  // Metody płatności
  const metodaBlik = await prisma.metodaPlatnosci.create({ data: { nazwa: 'BLIK', opis: 'Szybka płatność mobilna', czyAktywna: true } });
  const metodaPrzelew = await prisma.metodaPlatnosci.create({ data: { nazwa: 'Przelew Tradycyjny', opis: 'Płatność na konto bankowe', czyAktywna: true } });
  const metodaPrzyOdbiorze = await prisma.metodaPlatnosci.create({ data: { nazwa: 'Płatność przy odbiorze', czyAktywna: false } }); // Nieaktywna

  // Metody dostawy
  const dostawaKurier = await prisma.metodaDostawy.create({ data: { nazwa: 'Kurier DPD', koszt: new Decimal('15.99'), przewidywanyCzasDostawy: '1-2 dni robocze', czyAktywna: true } });
  const dostawaPaczkomat = await prisma.metodaDostawy.create({ data: { nazwa: 'Paczkomat InPost', koszt: new Decimal('12.50'), przewidywanyCzasDostawy: '1-3 dni robocze', czyAktywna: true } });
  const dostawaOdbior = await prisma.metodaDostawy.create({ data: { nazwa: 'Odbiór osobisty', koszt: new Decimal('0.00'), przewidywanyCzasDostawy: 'Po umówieniu', czyAktywna: true } });

  // Statusy zamówień
  const statusZamNowe = await prisma.statusZamowienia.create({ data: { nazwa: 'Nowe', opis: 'Zamówienie złożone, oczekuje na płatność.' } });
  const statusZamOplacone = await prisma.statusZamowienia.create({ data: { nazwa: 'Opłacone', opis: 'Płatność została zaksięgowana.' } });
  const statusZamWRealizacji = await prisma.statusZamowienia.create({ data: { nazwa: 'W realizacji', opis: 'Zamówienie jest przygotowywane do wysyłki.' } });
  const statusZamWyslane = await prisma.statusZamowienia.create({ data: { nazwa: 'Wysłane', opis: 'Paczka została nadana.' } });
  const statusZamZrealizowane = await prisma.statusZamowienia.create({ data: { nazwa: 'Zrealizowane', opis: 'Zamówienie dostarczone i zakończone.' } });
  const statusZamAnulowane = await prisma.statusZamowienia.create({ data: { nazwa: 'Anulowane', opis: 'Zamówienie zostało anulowane.' } });

  console.log('Base data created.');

  // --- Tworzenie Użytkowników ---
  console.log('Creating users...');
  // Prosty placeholder hasła - W PRAWDZIWEJ APLIKACJI UŻYJ bcrypt LUB PODOBNEGO!
  const placeholderHash = 'placeholder_hashed_password'; // await bcrypt.hash('password123', saltRounds);

  const userJan = await prisma.uzytkownik.create({
    data: {
      email: 'jan.kowalski@example.com',
      hasloHash: placeholderHash,
      imie: 'Jan',
      nazwisko: 'Kowalski',
      czyAktywny: true,
      rola: { connect: { id: rolaUser.id } },
    },
  });

  const userAnna = await prisma.uzytkownik.create({
    data: {
      email: 'anna.nowak@example.com',
      hasloHash: placeholderHash,
      imie: 'Anna',
      nazwisko: 'Nowak',
      czyAktywny: true,
      rola: { connect: { id: rolaUser.id } },
    },
  });

  const adminUser = await prisma.uzytkownik.create({
    data: {
      email: 'admin@ekwariat.com',
      hasloHash: placeholderHash, // Admin też potrzebuje hasła
      imie: 'Admin',
      nazwisko: 'Systemu',
      czyAktywny: true,
      rola: { connect: { id: rolaAdmin.id } },
    },
  });
  console.log('Users created:', userJan.id, userAnna.id, adminUser.id);

  // --- Tworzenie Adresów ---
  console.log('Creating addresses...');
  const adresJana1 = await prisma.adres.create({
    data: {
      ulica: 'Kwiatowa',
      numerDomu: '10',
      numerMieszkania: '5',
      kodPocztowy: '00-001',
      miasto: 'Warszawa',
      kraj: 'Polska',
      czyDomyslny: true,
      uzytkownik: { connect: { id: userJan.id } },
    },
  });

  const adresAnny1 = await prisma.adres.create({
    data: {
      ulica: 'Słoneczna',
      numerDomu: '25A',
      kodPocztowy: '30-002',
      miasto: 'Kraków',
      czyDomyslny: true,
      uzytkownik: { connect: { id: userAnna.id } },
    },
  });

    const adresAnny2 = await prisma.adres.create({
    data: {
      ulica: 'Leśna',
      numerDomu: '1',
      kodPocztowy: '50-005',
      miasto: 'Wrocław',
      czyDomyslny: false, // Niedomyślny
      uzytkownik: { connect: { id: userAnna.id } },
    },
  });
  console.log('Addresses created.');

  // --- Tworzenie Książek (więcej przykładów) ---
  console.log('Creating books...');
  const ksiazkaWiedzmin = await prisma.ksiazka.create({
    data: {
      tytul: 'Wiedźmin: Ostatnie życzenie', rokWydania: 1993, cena: new Decimal('35.99'),
      opisStanu: 'Stan bardzo dobry, lekko zagięty róg okładki.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorSapkowski.id }] },
      gatunki: { connect: [{ id: gatunekFantastyka.id }] },
      zdjecia: { create: [{ url: '/images/placeholder.png', opisAlt: 'Okładka Wiedźmin', czyGlowne: true }] },
    },
  });

  const ksiazkaLsnienie = await prisma.ksiazka.create({
    data: {
      tytul: 'Lśnienie', rokWydania: 1977, cena: new Decimal('29.50'),
      opisStanu: 'Stan dobry, normalne ślady użytkowania.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorKing.id }] },
      gatunki: { connect: [{ id: gatunekKryminal.id }, { id: gatunekFantastyka.id }] },
      zdjecia: { create: [{ url: '/images/placeholder.png', opisAlt: 'Okładka Lśnienie', czyGlowne: true }] },
    },
  });

  const ksiazkaHarryPotter = await prisma.ksiazka.create({
    data: {
      tytul: 'Harry Potter i Kamień Filozoficzny', rokWydania: 1997, cena: new Decimal('45.00'),
      opisStanu: 'Nowa, w folii.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorRowling.id }] },
      gatunki: { connect: [{ id: gatunekFantastyka.id }] },
      zdjecia: { create: [{ url: '/images/placeholder.png', opisAlt: 'Okładka HP1', czyGlowne: true }] },
    },
  });

  const ksiazkaHobbit = await prisma.ksiazka.create({
    data: {
      tytul: 'Hobbit, czyli tam i z powrotem', rokWydania: 1937, cena: new Decimal('25.00'),
      opisStanu: 'Używana, stan dostateczny, podpisana na pierwszej stronie.',
      statusKsiazki: { connect: { id: statusZarezerwowana.id } }, // Zarezerwowana
      autorzy: { connect: [{ id: autorTolkien.id }] },
      gatunki: { connect: [{ id: gatunekFantastyka.id }] },
      zdjecia: { create: [{ url: '/images/placeholder.png', opisAlt: 'Okładka Hobbit', czyGlowne: true }] },
    },
  });

  const ksiazkaBehawiorysta = await prisma.ksiazka.create({
    data: {
      tytul: 'Behawiorysta', rokWydania: 2016, cena: new Decimal('22.00'),
      opisStanu: 'Stan dobry, lekko porysowana okładka.',
      statusKsiazki: { connect: { id: statusSprzedana.id } }, // Sprzedana
      autorzy: { connect: [{ id: autorMróz.id }] },
      gatunki: { connect: [{ id: gatunekKryminal.id }] },
      zdjecia: { create: [{ url: '/images/placeholder.png', opisAlt: 'Okładka Behawiorysta', czyGlowne: true }] },
    },
  });

    // Książka dodana przez zgłoszenie (utworzymy ją później, ale potrzebujemy ID)
    const ksiazkaZeZgloszenia = await prisma.ksiazka.create({
        data: {
          tytul: 'Sekrety efektywności', rokWydania: 2020, cena: new Decimal('33.33'),
          opisStanu: 'Jak nowa, przeczytana raz.',
          statusKsiazki: { connect: { id: statusDostepna.id } }, // Dostępna po akceptacji
          autorzy: { connect: [{ id: autorNieznany.id }] }, // Początkowo nieznany, można zaktualizować
          gatunki: { connect: [{ id: gatunekPoradnik.id }] },
          // Zdjęcia można dodać później lub w procesie akceptacji zgłoszenia
        },
      });
  console.log('Books created.');


  // --- Tworzenie Rezerwacji ---
  console.log('Creating reservations...');
  const rezerwacjaHobbit = await prisma.rezerwacja.create({
    data: {
      dataRozpoczecia: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dni temu
      dataZakonczenia: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Za 4 dni
      statusRezerwacji: 'Aktywna',
      uzytkownik: { connect: { id: userAnna.id } },
      ksiazka: { connect: { id: ksiazkaHobbit.id } },
    },
  });
  console.log('Reservations created.');

  // --- Tworzenie Zgłoszeń Książek ---
  console.log('Creating book submissions (Zgloszenia)...');
  const zgloszenieNowe = await prisma.zgloszenieKsiazki.create({
    data: {
      autorTekst: 'Stephen King',
      tytulTekst: 'Zielona Mila',
      stanOpis: 'Stan dobry, lekkie ślady na grzbiecie.',
      opisDodatkowy: 'Wydanie kieszonkowe.',
      statusZgloszenia: 'Nowe',
      uzytkownikZglaszajacy: { connect: { id: userJan.id } },
    },
  });

  const zgloszenieZaakceptowane = await prisma.zgloszenieKsiazki.create({
    data: {
      autorTekst: 'Nieznany (do weryfikacji)',
      tytulTekst: 'Sekrety efektywności',
      stanOpis: 'Jak nowa, przeczytana raz.',
      opisDodatkowy: 'Ciekawy poradnik o zarządzaniu czasem.',
      statusZgloszenia: 'Zaakceptowane',
      decyzjaAdminaOpis: 'Dodano do oferty. Uzupełniono autora jako "Autor Nieznany".',
      dataDecyzji: new Date(),
      uzytkownikZglaszajacy: { connect: { id: userAnna.id } },
      adminOceniajacy: { connect: { id: adminUser.id } },
      ksiazkaPoDodaniu: { connect: { id: ksiazkaZeZgloszenia.id } }, // Łączymy z utworzoną książką
    },
  });

  const zgloszenieOdrzucone = await prisma.zgloszenieKsiazki.create({
    data: {
      autorTekst: 'J.R.R. Tolkien',
      tytulTekst: 'Władca Pierścieni - Dwie Wieże',
      stanOpis: 'Mocno zniszczona, brak kilku stron.',
      statusZgloszenia: 'Odrzucone',
      decyzjaAdminaOpis: 'Książka w zbyt złym stanie technicznym.',
      dataDecyzji: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Wczoraj
      uzytkownikZglaszajacy: { connect: { id: userJan.id } },
      adminOceniajacy: { connect: { id: adminUser.id } },
    },
  });
  console.log('Book submissions created.');


  // --- Tworzenie Zamówień ---
  console.log('Creating orders...');
  // Zamówienie 1: Zrealizowane (Anna kupiła Behawiorystę)
  const zamowienie1 = await prisma.zamowienie.create({
    data: {
      numerZamowienia: `ZAM-${Date.now()}-A`, // Prosty unikalny numer
      lacznaWartosc: ksiazkaBehawiorysta.cena.add(dostawaKurier.koszt), // Cena książki + koszt dostawy
      kosztDostawy: dostawaKurier.koszt,
      dataWyslania: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Wysłane 2 dni temu
      uwagiKlienta: 'Proszę o dostawę po 16:00.',
      uzytkownik: { connect: { id: userAnna.id } },
      adresDostawy: { connect: { id: adresAnny1.id } }, // Domyślny adres Anny
      metodaDostawy: { connect: { id: dostawaKurier.id } },
      statusZamowienia: { connect: { id: statusZamZrealizowane.id } }, // Zrealizowane
      pozycje: {
        create: [
          {
            ilosc: 1,
            cenaJednostkowa: ksiazkaBehawiorysta.cena,
            ksiazka: { connect: { id: ksiazkaBehawiorysta.id } },
          },
        ],
      },
      platnosci: {
        create: [
          {
            kwota: ksiazkaBehawiorysta.cena.add(dostawaKurier.koszt),
            statusPlatnosci: 'Udana',
            dataPlatnosci: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Opłacone 3 dni temu
            metodaPlatnosci: { connect: { id: metodaBlik.id } },
            idTransakcjiZewn: `BLIK-${Date.now()}`
          }
        ]
      }
    },
  });

  // Zamówienie 2: Nowe, oczekujące na płatność (Jan chce kupić Wiedźmina)
  const zamowienie2 = await prisma.zamowienie.create({
    data: {
      numerZamowienia: `ZAM-${Date.now()}-B`,
      lacznaWartosc: ksiazkaWiedzmin.cena.add(dostawaPaczkomat.koszt),
      kosztDostawy: dostawaPaczkomat.koszt,
      uzytkownik: { connect: { id: userJan.id } },
      adresDostawy: { connect: { id: adresJana1.id } },
      metodaDostawy: { connect: { id: dostawaPaczkomat.id } },
      statusZamowienia: { connect: { id: statusZamNowe.id } }, // Nowe
      pozycje: {
        create: [
          {
            ilosc: 1,
            cenaJednostkowa: ksiazkaWiedzmin.cena,
            ksiazka: { connect: { id: ksiazkaWiedzmin.id } },
          },
        ],
      },
       platnosci: {
        create: [
          {
            kwota: ksiazkaWiedzmin.cena.add(dostawaPaczkomat.koszt),
            statusPlatnosci: 'Oczekujaca', // Oczekuje
            metodaPlatnosci: { connect: { id: metodaPrzelew.id } },
          }
        ]
      }
    },
  });
  console.log('Orders created.');

  // --- Można dodać więcej danych dla innych scenariuszy ---
  // np. zamówienie anulowane, płatność nieudana, użytkownik z wieloma adresami itp.

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });