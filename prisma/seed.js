// prisma/seed.js
const { PrismaClient, Role } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Statusy Książek ---
  const statusDostepna = await prisma.statusKsiazki.upsert({
    where: { nazwa: 'Dostępna' },
    update: {},
    create: { nazwa: 'Dostępna' },
  });

  const statusSprzedana = await prisma.statusKsiazki.upsert({
    where: { nazwa: 'Sprzedana' },
    update: {},
    create: { nazwa: 'Sprzedana' },
  });

  const statusRezerwacja = await prisma.statusKsiazki.upsert({
    where: { nazwa: 'Zarezerwowana' },
    update: {},
    create: { nazwa: 'Zarezerwowana' },
  });

  // --- Statusy Zamówień ---
  const statusZamNowe = await prisma.statusZamowienia.upsert({
    where: { nazwa: 'Nowe' },
    update: {},
    create: { nazwa: 'Nowe', opis: 'Zamówienie zostało złożone.' },
  });

  console.log('Created basic statuses.');

  // --- Autorzy ---
  // Zakładamy, że ID autora jest @default(autoincrement()), więc nie podajemy go w `create`
  // jeśli chcemy, aby baza nadała ID. Jeśli chcemy konkretne ID dla seeda,
  // to `where: {id: X}` i `create: {id: X, ...}` jest OK, ale `id` w `create`
  // jest wtedy potrzebne, aby Prisma wiedziała, jakie ID nadać, jeśli rekord nie istnieje.
  // Dla spójności z poprawką dla książek, jeśli Autor.id jest autoincrement,
  // lepiej polegać na innym unikalnym polu w `where` lib tworzyć bez `id` w `create`.
  // Poniżej zostawiam podejście z wymuszaniem ID dla autorów, bo tak było wcześniej.
  const autorSapkowski = await prisma.autor.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      imie: 'Andrzej',
      nazwisko: 'Sapkowski',
      opis: 'Polski pisarz fantasy.',
    },
  });

  const autorLem = await prisma.autor.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      imie: 'Stanisław',
      nazwisko: 'Lem',
      opis: 'Polski pisarz science fiction, filozof.',
    },
  });

  const autorTolkien = await prisma.autor.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      imie: 'J.R.R.',
      nazwisko: 'Tolkien',
      opis: 'Angielski pisarz oraz profesor filologii klasycznej i literatury staroangielskiej na Uniwersytecie Oksfordzkim.',
    },
  });

  const autorHerbert = await prisma.autor.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      imie: 'Frank',
      nazwisko: 'Herbert',
      opis: 'Amerykański pisarz science fiction.',
    },
  });

  const autorLewis = await prisma.autor.upsert({
    where: { id: 5 }, // Nowy autor dla Narnii
    update: {},
    create: {
      id: 5,
      imie: 'C.S.',
      nazwisko: 'Lewis',
      opis: 'Brytyjski pisarz, filolog i świecki teolog anglikański.',
    },
  });


  console.log(`Created authors: Sapkowski, Lem, Tolkien, Herbert, Lewis`);

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

  const gatunekRomans = await prisma.gatunek.upsert({
    where: { nazwa: 'Romans' },
    update: {},
    create: { nazwa: 'Romans', opis: 'Historie miłosne.' },
  });

  console.log(`Created genres: Fantasy, Science Fiction, Przygodowa, Romans`);

  // --- Książki ---
  // ID Książki jest @default(autoincrement()), więc NIE podajemy go w `create`.
  // `where: { id: X }` w `upsert` służy do znalezienia rekordu do aktualizacji.

  await prisma.ksiazka.upsert({
    where: { id: 1 },
    update: { // Pola do aktualizacji, jeśli książka o ID 1 istnieje
      tytul: 'Wiedźmin: Ostatnie życzenie',
      rokWydania: 1993,
      cena: 35.99,
      opisStanu: 'Bardzo dobry, lekkie ślady użytkowania na okładce.',
      statusKsiazkiId: statusDostepna.id,
      // Można też zaktualizować relacje, np. używając `set` do nadpisania
      // autorzy: { set: [{ id: autorSapkowski.id }] },
      // gatunki: { set: [{ id: gatunekFantasy.id }] },
    },
    create: { // Pola do stworzenia, jeśli książka o ID 1 nie istnieje
      // id: 1, <--- USUNIĘTE, bo jest autoincrement
      tytul: 'Wiedźmin: Ostatnie życzenie',
      rokWydania: 1993,
      cena: 35.99,
      opisStanu: 'Bardzo dobry, lekkie ślady użytkowania na okładce.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorSapkowski.id }] },
      gatunki: { connect: [{ id: gatunekFantasy.id }] },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Wiedźmina', czyGlowne: true },
          { url: '/images/cover.png', opisAlt: 'Strona z Wiedźmina', czyGlowne: false },
        ]
      }
    },
  });

  await prisma.ksiazka.upsert({
    where: { id: 2 },
    update: {
      tytul: 'Solaris',
      rokWydania: 1961,
      cena: 29.50,
      opisStanu: 'Dobry, lekkie zagięcia okładki, pożółkłe strony.',
      statusKsiazkiId: statusDostepna.id,
    },
    create: {
      // id: 2, <--- USUNIĘTE
      tytul: 'Solaris',
      rokWydania: 1961,
      cena: 29.50,
      opisStanu: 'Dobry, lekkie zagięcia okładki, pożółkłe strony.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorLem.id }] },
      gatunki: { connect: [{ id: gatunekSciFi.id }] },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Solaris', czyGlowne: true },
        ]
      }
    },
  });

  await prisma.ksiazka.upsert({
    where: { id: 3 },
    update: {
      tytul: 'Hobbit, czyli tam i z powrotem',
      rokWydania: 1937,
      cena: 45.00,
      opisStanu: 'Stan idealny, jak nowa.',
      statusKsiazkiId: statusDostepna.id,
    },
    create: {
      // id: 3, <--- USUNIĘTE
      tytul: 'Hobbit, czyli tam i z powrotem',
      rokWydania: 1937,
      cena: 45.00,
      opisStanu: 'Stan idealny, jak nowa.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorTolkien.id }] },
      gatunki: { connect: [{ id: gatunekFantasy.id }, { id: gatunekPrzygodowa.id }] },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Hobbita', czyGlowne: true },
        ]
      }
    },
  });

  await prisma.ksiazka.upsert({
    where: { id: 4 },
    update: {
      tytul: 'Diuna',
      rokWydania: 1965,
      cena: 55.90,
      opisStanu: 'Dobry plus, niewielkie przetarcia na grzbiecie.',
      statusKsiazkiId: statusDostepna.id,
    },
    create: {
      // id: 4, <--- USUNIĘTE
      tytul: 'Diuna',
      rokWydania: 1965,
      cena: 55.90,
      opisStanu: 'Dobry plus, niewielkie przetarcia na grzbiecie.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorHerbert.id }] },
      gatunki: { connect: [{ id: gatunekSciFi.id }] },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Diuny', czyGlowne: true },
        ]
      }
    },
  });

  await prisma.ksiazka.upsert({
    where: { id: 5 },
    update: {
      tytul: 'Opowieści z Narnii: Lew, czarownica i stara szafa',
      rokWydania: 1950,
      cena: 22.00,
      opisStanu: 'Stan dostateczny, okładka podniszczona, strony czyste.',
      statusKsiazkiId: statusDostepna.id,
    },
    create: {
      // id: 5, <--- USUNIĘTE
      tytul: 'Opowieści z Narnii: Lew, czarownica i stara szafa',
      rokWydania: 1950,
      cena: 22.00,
      opisStanu: 'Stan dostateczny, okładka podniszczona, strony czyste.',
      statusKsiazki: { connect: { id: statusDostepna.id } },
      autorzy: { connect: [{ id: autorLewis.id }] }, // Połączenie z nowo dodanym autorem C.S. Lewis
      gatunki: { connect: [{ id: gatunekFantasy.id }, { id: gatunekPrzygodowa.id }] },
      zdjecia: {
        create: [
          { url: '/images/cover.png', opisAlt: 'Okładka Narnii', czyGlowne: true },
        ]
      }
    },
  });

  console.log(`Created/updated books.`);

  // --- Użytkownicy ---
  // Zakładamy, że User.id jest autoincrement, więc nie podajemy go w create.
  // Jeśli chcesz konkretne ID, to where: {id: X} i create: {id: X, ...}
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' }, // email jest @unique, więc dobre dla where
    update: { // Co zaktualizować, jeśli user istnieje
        nazwisko: 'Kowalski',
        name: 'Jan',
        role: Role.USER,
        czyAktywny: true,
        // Nie aktualizuj hasła przy każdym seedowaniu, chyba że to celowe
    },
    create: {
      // id: 1, // Jeśli User.id jest autoincrement, nie podawaj
      email: 'test@example.com',
      password: 'password123_seed', // PAMIĘTAJ: To powinno być zahashowane w prawdziwej aplikacji!
      nazwisko: 'Kowalski',
      name: 'Jan',
      role: Role.USER,
      czyAktywny: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
        nazwisko: 'Admin',
        name: 'Super',
        role: Role.ADMIN,
        czyAktywny: true,
    },
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