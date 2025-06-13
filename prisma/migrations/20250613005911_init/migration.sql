-- CreateTable
CREATE TABLE "Uzytkownicy" (
    "ID_Uzytkownika" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nazwisko" TEXT,
    "name" TEXT,
    "password" TEXT,
    "Data_Rejestracji" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "Czy_Aktywny" BOOLEAN NOT NULL DEFAULT true,
    "Token_Reset_Hasla" TEXT,
    "Data_Wazn_Tokenu" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "Adresy" (
    "ID_Adresu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ulica" TEXT NOT NULL,
    "Numer_Domu" TEXT NOT NULL,
    "Numer_Mieszkania" TEXT,
    "Kod_Pocztowy" TEXT NOT NULL,
    "miasto" TEXT NOT NULL,
    "kraj" TEXT NOT NULL DEFAULT 'Polska',
    "Czy_Domyslny" BOOLEAN NOT NULL DEFAULT false,
    "ID_Uzytkownika" INTEGER NOT NULL,
    CONSTRAINT "Adresy_ID_Uzytkownika_fkey" FOREIGN KEY ("ID_Uzytkownika") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TypyProduktow" (
    "ID_Typu_Produktu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nazwa_Typu_Produktu" TEXT NOT NULL,
    "opis" TEXT,
    "slug" TEXT
);

-- CreateTable
CREATE TABLE "StatusyProduktow" (
    "ID_Statusu_Produktu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nazwa_Statusu_Produktu" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Autorzy" (
    "ID_Autora" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imie" TEXT,
    "nazwisko" TEXT NOT NULL,
    "opis" TEXT
);

-- CreateTable
CREATE TABLE "Gatunki" (
    "ID_Gatunku" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT
);

-- CreateTable
CREATE TABLE "Artysci" (
    "ID_Artysty" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imie" TEXT,
    "nazwisko" TEXT NOT NULL,
    "rola" TEXT
);

-- CreateTable
CREATE TABLE "Produkty" (
    "ID_Produktu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tytul" TEXT NOT NULL,
    "cena" DECIMAL NOT NULL,
    "opisStanu" TEXT NOT NULL,
    "opis" TEXT,
    "Data_Dodania" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Data_Modyfikacji" DATETIME,
    "Kod_EAN_ISBN" TEXT,
    "Czy_Polecany" BOOLEAN NOT NULL DEFAULT false,
    "Czy_Nowosc" BOOLEAN NOT NULL DEFAULT false,
    "typProduktuId" INTEGER NOT NULL,
    "ID_Statusu_Produktu" INTEGER NOT NULL,
    "czyZarezerwowany" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Produkty_ID_Statusu_Produktu_fkey" FOREIGN KEY ("ID_Statusu_Produktu") REFERENCES "StatusyProduktow" ("ID_Statusu_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Produkty_typProduktuId_fkey" FOREIGN KEY ("typProduktuId") REFERENCES "TypyProduktow" ("ID_Typu_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneKsiazek" (
    "ID_Danych_Ksiazki" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Rok_Wydania" INTEGER,
    "liczbaStron" INTEGER,
    "wydawnictwo" TEXT,
    "oprawa" TEXT,
    "format" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneKsiazek_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneAudiobookow" (
    "ID_Danych_Audiobooka" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lektor" TEXT,
    "Czas_Trwania_Min" INTEGER,
    "Format_Pliku" TEXT NOT NULL DEFAULT 'MP3',
    "rokWydania" INTEGER,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneAudiobookow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneEbookow" (
    "ID_Danych_Ebooka" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Format_Pliku" TEXT NOT NULL,
    "zabezpieczenia" TEXT,
    "rokWydania" INTEGER,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneEbookow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneKomiksow" (
    "ID_Danych_Komiksu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seria" TEXT,
    "Numer_W_Serii" INTEGER,
    "wydawnictwo" TEXT,
    "rokWydania" INTEGER,
    "liczbaStron" INTEGER,
    "oprawa" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneKomiksow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneCzasopism" (
    "ID_Danych_Czasopisma" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Numer_Wydania" TEXT,
    "wydawca" TEXT,
    "czestotliwosc" TEXT,
    "Data_Wydania_Czasopisma" DATETIME,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneCzasopism_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneMapPrzewodnikow" (
    "ID_Danych_Mapy_Przewodnika" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "skala" TEXT,
    "region" TEXT,
    "wydanie" TEXT,
    "Rok_Aktualizacji" INTEGER,
    "rodzaj" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneMapPrzewodnikow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DanePodrecznikow" (
    "ID_Danych_Podrecznika" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "przedmiot" TEXT NOT NULL,
    "Poziom_Edukacji" TEXT NOT NULL,
    "klasa" TEXT,
    "Rok_Szkolny_Dedykowany" TEXT,
    "Numer_Dopuszczenia_MEN" TEXT,
    "wydawnictwo" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DanePodrecznikow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneKsiazekDoNaukiJezyka" (
    "ID_Danych_Ksiazki_Nauka_Jezyka" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Jezyk_Docelowy" TEXT NOT NULL,
    "Poziom_Zaawansowania" TEXT,
    "Czy_Zawiera_Audio" BOOLEAN NOT NULL DEFAULT false,
    "typMaterialu" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneKsiazekDoNaukiJezyka_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneKsiazekObcojezycznych" (
    "ID_Danych_Ksiazki_Obcojezycznej" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Jezyk_Oryginalny" TEXT NOT NULL,
    "Rok_Oryginalnego_Wydania" INTEGER,
    "tlumacz" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneKsiazekObcojezycznych_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaneZabawek" (
    "ID_Danych_Zabawki" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Wiek_Docelowy_Od" INTEGER,
    "Wiek_Docelowy_Do" INTEGER,
    "producent" TEXT,
    "material" TEXT,
    "certyfikaty" TEXT,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "DaneZabawek_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZdjeciaProduktow" (
    "ID_Zdjecia_Produktu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "Opis_Alt" TEXT,
    "Czy_Glowne" BOOLEAN NOT NULL DEFAULT false,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "ZdjeciaProduktow_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MetodyDostawy" (
    "ID_Metody_Dostawy" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "koszt" DECIMAL NOT NULL,
    "Przewidywany_Czas_Dostawy" TEXT,
    "Czy_Aktywna" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "MetodyPlatnosci" (
    "ID_Metody_Platnosci" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT,
    "Czy_Aktywna" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Platnosci" (
    "ID_Platnosci" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kwota" DECIMAL NOT NULL,
    "Data_Platnosci" DATETIME,
    "Status_Platnosci" TEXT NOT NULL,
    "Id_Transakcji_Zewn" TEXT,
    "ID_Zamowienia" INTEGER NOT NULL,
    "ID_Metody_Platnosci" INTEGER NOT NULL,
    CONSTRAINT "Platnosci_ID_Metody_Platnosci_fkey" FOREIGN KEY ("ID_Metody_Platnosci") REFERENCES "MetodyPlatnosci" ("ID_Metody_Platnosci") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Platnosci_ID_Zamowienia_fkey" FOREIGN KEY ("ID_Zamowienia") REFERENCES "Zamowienia" ("ID_Zamowienia") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PozycjeZamowien" (
    "ID_Pozycji_Zamowienia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ilosc" INTEGER NOT NULL DEFAULT 1,
    "Cena_Jednostkowa" DECIMAL NOT NULL,
    "ID_Zamowienia" INTEGER NOT NULL,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "PozycjeZamowien_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PozycjeZamowien_ID_Zamowienia_fkey" FOREIGN KEY ("ID_Zamowienia") REFERENCES "Zamowienia" ("ID_Zamowienia") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StatusyZamowien" (
    "ID_Statusu_Zamowienia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT
);

-- CreateTable
CREATE TABLE "Zamowienia" (
    "ID_Zamowienia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Numer_Zamowienia" TEXT NOT NULL,
    "Data_Zlozenia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Data_Wyslania" DATETIME,
    "Laczna_Wartosc" DECIMAL NOT NULL,
    "Koszt_Dostawy" DECIMAL NOT NULL,
    "Uwagi_Klienta" TEXT,
    "ID_Uzytkownika" INTEGER NOT NULL,
    "ID_Adresu_Dostawy" INTEGER NOT NULL,
    "ID_Metody_Dostawy" INTEGER NOT NULL,
    "ID_Statusu_Zamowienia" INTEGER NOT NULL,
    CONSTRAINT "Zamowienia_ID_Statusu_Zamowienia_fkey" FOREIGN KEY ("ID_Statusu_Zamowienia") REFERENCES "StatusyZamowien" ("ID_Statusu_Zamowienia") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Metody_Dostawy_fkey" FOREIGN KEY ("ID_Metody_Dostawy") REFERENCES "MetodyDostawy" ("ID_Metody_Dostawy") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Adresu_Dostawy_fkey" FOREIGN KEY ("ID_Adresu_Dostawy") REFERENCES "Adresy" ("ID_Adresu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Uzytkownika_fkey" FOREIGN KEY ("ID_Uzytkownika") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rezerwacje" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataRezerwacji" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produktId" INTEGER NOT NULL,
    "uzytkownikId" INTEGER NOT NULL,
    CONSTRAINT "Rezerwacje_produktId_fkey" FOREIGN KEY ("produktId") REFERENCES "Produkty" ("ID_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rezerwacje_uzytkownikId_fkey" FOREIGN KEY ("uzytkownikId") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZgloszeniaProduktow" (
    "ID_Zgloszenia_Produktu" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nazwa_Produktu_Tekst" TEXT NOT NULL,
    "Typ_Produktu_Tekst" TEXT,
    "Identyfikator_Produktu_Tekst" TEXT,
    "Stan_Opis" TEXT NOT NULL,
    "Opis_Dodatkowy" TEXT,
    "Data_Zgloszenia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status_Zgloszenia" TEXT NOT NULL DEFAULT 'Nowe',
    "Decyzja_Admina_Opis" TEXT,
    "Data_Decyzji" DATETIME,
    "ID_Uzytkownika_Zglaszajacego" INTEGER NOT NULL,
    "ID_Admina_Oceniajacego" INTEGER,
    "ID_Produktu_Po_Dodaniu" INTEGER,
    CONSTRAINT "ZgloszeniaProduktow_ID_Produktu_Po_Dodaniu_fkey" FOREIGN KEY ("ID_Produktu_Po_Dodaniu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ZgloszeniaProduktow_ID_Uzytkownika_Zglaszajacego_fkey" FOREIGN KEY ("ID_Uzytkownika_Zglaszajacego") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Koszyki" (
    "ID_Koszyka" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Uzytkownika" INTEGER NOT NULL,
    CONSTRAINT "Koszyki_ID_Uzytkownika_fkey" FOREIGN KEY ("ID_Uzytkownika") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PozycjeKoszyka" (
    "ID_Pozycji_Koszyka" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ilosc" INTEGER NOT NULL DEFAULT 1,
    "ID_Koszyka" INTEGER NOT NULL,
    "ID_Produktu" INTEGER NOT NULL,
    CONSTRAINT "PozycjeKoszyka_ID_Produktu_fkey" FOREIGN KEY ("ID_Produktu") REFERENCES "Produkty" ("ID_Produktu") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PozycjeKoszyka_ID_Koszyka_fkey" FOREIGN KEY ("ID_Koszyka") REFERENCES "Koszyki" ("ID_Koszyka") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AutorDaneAudiobooka" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AutorDaneAudiobooka_A_fkey" FOREIGN KEY ("A") REFERENCES "Autorzy" ("ID_Autora") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AutorDaneAudiobooka_B_fkey" FOREIGN KEY ("B") REFERENCES "DaneAudiobookow" ("ID_Danych_Audiobooka") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AutorDaneKomiksu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AutorDaneKomiksu_A_fkey" FOREIGN KEY ("A") REFERENCES "Autorzy" ("ID_Autora") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AutorDaneKomiksu_B_fkey" FOREIGN KEY ("B") REFERENCES "DaneKomiksow" ("ID_Danych_Komiksu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AutorDaneKsiazki" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AutorDaneKsiazki_A_fkey" FOREIGN KEY ("A") REFERENCES "Autorzy" ("ID_Autora") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AutorDaneKsiazki_B_fkey" FOREIGN KEY ("B") REFERENCES "DaneKsiazek" ("ID_Danych_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ArtystaDaneKomiksu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArtystaDaneKomiksu_A_fkey" FOREIGN KEY ("A") REFERENCES "Artysci" ("ID_Artysty") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArtystaDaneKomiksu_B_fkey" FOREIGN KEY ("B") REFERENCES "DaneKomiksow" ("ID_Danych_Komiksu") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GatunekDaneKsiazki" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GatunekDaneKsiazki_A_fkey" FOREIGN KEY ("A") REFERENCES "DaneKsiazek" ("ID_Danych_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GatunekDaneKsiazki_B_fkey" FOREIGN KEY ("B") REFERENCES "Gatunki" ("ID_Gatunku") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GatunekDaneAudiobooka" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GatunekDaneAudiobooka_A_fkey" FOREIGN KEY ("A") REFERENCES "DaneAudiobookow" ("ID_Danych_Audiobooka") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GatunekDaneAudiobooka_B_fkey" FOREIGN KEY ("B") REFERENCES "Gatunki" ("ID_Gatunku") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GatunekDaneKomiksu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GatunekDaneKomiksu_A_fkey" FOREIGN KEY ("A") REFERENCES "DaneKomiksow" ("ID_Danych_Komiksu") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GatunekDaneKomiksu_B_fkey" FOREIGN KEY ("B") REFERENCES "Gatunki" ("ID_Gatunku") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Uzytkownicy_Email_UN" ON "Uzytkownicy"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TypyProduktow_Nazwa_Typu_Produktu_key" ON "TypyProduktow"("Nazwa_Typu_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "TypyProduktow_slug_key" ON "TypyProduktow"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StatusyProduktow_Nazwa_Statusu_Produktu_key" ON "StatusyProduktow"("Nazwa_Statusu_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "Gatunki_Nazwa_UN" ON "Gatunki"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "Produkty_Kod_EAN_ISBN_key" ON "Produkty"("Kod_EAN_ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "DaneKsiazek_ID_Produktu_key" ON "DaneKsiazek"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneAudiobookow_ID_Produktu_key" ON "DaneAudiobookow"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneEbookow_ID_Produktu_key" ON "DaneEbookow"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneKomiksow_ID_Produktu_key" ON "DaneKomiksow"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneCzasopism_ID_Produktu_key" ON "DaneCzasopism"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneMapPrzewodnikow_ID_Produktu_key" ON "DaneMapPrzewodnikow"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DanePodrecznikow_ID_Produktu_key" ON "DanePodrecznikow"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneKsiazekDoNaukiJezyka_ID_Produktu_key" ON "DaneKsiazekDoNaukiJezyka"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneKsiazekObcojezycznych_ID_Produktu_key" ON "DaneKsiazekObcojezycznych"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "DaneZabawek_ID_Produktu_key" ON "DaneZabawek"("ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "MetodyDostawy_nazwa_key" ON "MetodyDostawy"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "PozZam_Uniq_Zam_Produkt" ON "PozycjeZamowien"("ID_Zamowienia", "ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "StatusyZamowien_Nazwa_UN" ON "StatusyZamowien"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "Zamowienia_Numer_UN" ON "Zamowienia"("Numer_Zamowienia");

-- CreateIndex
CREATE UNIQUE INDEX "Rezerwacje_produktId_key" ON "Rezerwacje"("produktId");

-- CreateIndex
CREATE UNIQUE INDEX "ZgloszProd_Produkt_UN" ON "ZgloszeniaProduktow"("ID_Produktu_Po_Dodaniu");

-- CreateIndex
CREATE UNIQUE INDEX "Koszyki_ID_Uzytkownika_key" ON "Koszyki"("ID_Uzytkownika");

-- CreateIndex
CREATE UNIQUE INDEX "PozKosz_Uniq_Kosz_Produkt" ON "PozycjeKoszyka"("ID_Koszyka", "ID_Produktu");

-- CreateIndex
CREATE UNIQUE INDEX "_AutorDaneAudiobooka_AB_unique" ON "_AutorDaneAudiobooka"("A", "B");

-- CreateIndex
CREATE INDEX "_AutorDaneAudiobooka_B_index" ON "_AutorDaneAudiobooka"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AutorDaneKomiksu_AB_unique" ON "_AutorDaneKomiksu"("A", "B");

-- CreateIndex
CREATE INDEX "_AutorDaneKomiksu_B_index" ON "_AutorDaneKomiksu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AutorDaneKsiazki_AB_unique" ON "_AutorDaneKsiazki"("A", "B");

-- CreateIndex
CREATE INDEX "_AutorDaneKsiazki_B_index" ON "_AutorDaneKsiazki"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArtystaDaneKomiksu_AB_unique" ON "_ArtystaDaneKomiksu"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtystaDaneKomiksu_B_index" ON "_ArtystaDaneKomiksu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GatunekDaneKsiazki_AB_unique" ON "_GatunekDaneKsiazki"("A", "B");

-- CreateIndex
CREATE INDEX "_GatunekDaneKsiazki_B_index" ON "_GatunekDaneKsiazki"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GatunekDaneAudiobooka_AB_unique" ON "_GatunekDaneAudiobooka"("A", "B");

-- CreateIndex
CREATE INDEX "_GatunekDaneAudiobooka_B_index" ON "_GatunekDaneAudiobooka"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GatunekDaneKomiksu_AB_unique" ON "_GatunekDaneKomiksu"("A", "B");

-- CreateIndex
CREATE INDEX "_GatunekDaneKomiksu_B_index" ON "_GatunekDaneKomiksu"("B");
