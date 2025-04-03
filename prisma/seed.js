const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const rolaUser = await prisma.rola.upsert({
    where: { nazwa: 'Uzytkownik' },
    update: {},
    create: { nazwa: 'Uzytkownik' },
  });

  const rolaAdmin = await prisma.rola.upsert({
    where: { nazwa: 'Admin' },
    update: {},
    create: { nazwa: 'Admin' },
  });

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

   const statusNowe = await prisma.statusZamowienia.upsert({
    where: { nazwa: 'Nowe' },
    update: {},
    create: { nazwa: 'Nowe', opis: 'Zamówienie zostało złożone.' },
  });

  console.log('Created basic roles and statuses.');

  const autor1 = await prisma.autor.upsert({
    where: { id: 1 },
    update: {},
    create: {
      imie: 'Andrzej',
      nazwisko: 'Sapkowski',
      opis: 'Polski pisarz fantasy.',
    },
  });

  const autor2 = await prisma.autor.upsert({
     where: { id: 2 },
     update: {},
     create: {
      imie: 'Stanisław',
      nazwisko: 'Lem',
      opis: 'Polski pisarz science fiction, filozof.',
    },
  });
  console.log(`Created authors: ${autor1.nazwisko}, ${autor2.nazwisko}`);

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
  console.log(`Created genres: ${gatunekFantasy.nazwa}, ${gatunekSciFi.nazwa}`);

  const ksiazka1 = await prisma.ksiazka.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tytul: 'Wiedźmin: Ostatnie życzenie',
      rokWydania: 1993,
      cena: 35.99,
      opisStanu: 'Bardzo dobry',
      statusKsiazki: {
        connect: { id: statusDostepna.id },
      },
      autorzy: {
        connect: { id: autor1.id },
      },
      gatunki: {
        connect: { id: gatunekFantasy.id },
      },
    },
  });

  const ksiazka2 = await prisma.ksiazka.upsert({
    where: { id: 2 },
    update: {},
    create: {
      tytul: 'Solaris',
      rokWydania: 1961,
      cena: 29.50,
      opisStanu: 'Dobry, lekkie zagięcia okładki',
      statusKsiazki: {
        connect: { id: statusDostepna.id },
      },
      autorzy: {
        connect: { id: autor2.id },
      },
      gatunki: {
        connect: { id: gatunekSciFi.id },
      },
    },
  });

  console.log(`Created books: "${ksiazka1.tytul}", "${ksiazka2.tytul}"`);

  const user1 = await prisma.uzytkownik.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      hasloHash: 'plain_password_for_seed_only',
      imie: 'Jan',
      nazwisko: 'Kowalski',
      rola: {
        connect: { id: rolaUser.id },
      },
      czyAktywny: true,
    },
  });
  console.log(`Created user: ${user1.email}`);

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