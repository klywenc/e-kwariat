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
CREATE TABLE "Ksiazki" (
    "ID_Ksiazki" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tytul" TEXT NOT NULL,
    "Rok_Wydania" INTEGER,
    "cena" DECIMAL NOT NULL,
    "Opis_Stanu" TEXT NOT NULL,
    "Data_Dodania" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Data_Modyfikacji" DATETIME,
    "ID_Statusu_Ksiazki" INTEGER NOT NULL,
    CONSTRAINT "Ksiazki_ID_Statusu_Ksiazki_fkey" FOREIGN KEY ("ID_Statusu_Ksiazki") REFERENCES "StatusyKsiazek" ("ID_Statusu_Ksiazki") ON DELETE RESTRICT ON UPDATE CASCADE
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
    CONSTRAINT "Platnosci_ID_Zamowienia_fkey" FOREIGN KEY ("ID_Zamowienia") REFERENCES "Zamowienia" ("ID_Zamowienia") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Platnosci_ID_Metody_Platnosci_fkey" FOREIGN KEY ("ID_Metody_Platnosci") REFERENCES "MetodyPlatnosci" ("ID_Metody_Platnosci") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PozycjeZamowien" (
    "ID_Pozycji_Zamowienia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ilosc" INTEGER NOT NULL DEFAULT 1,
    "Cena_Jednostkowa" DECIMAL NOT NULL,
    "ID_Zamowienia" INTEGER NOT NULL,
    "ID_Ksiazki" INTEGER NOT NULL,
    CONSTRAINT "PozycjeZamowien_ID_Zamowienia_fkey" FOREIGN KEY ("ID_Zamowienia") REFERENCES "Zamowienia" ("ID_Zamowienia") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PozycjeZamowien_ID_Ksiazki_fkey" FOREIGN KEY ("ID_Ksiazki") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rezerwacje" (
    "ID_Rezerwacji" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Data_Rozpoczecia" DATETIME NOT NULL,
    "Data_Zakonczenia" DATETIME NOT NULL,
    "Status_Rezerwacji" TEXT NOT NULL DEFAULT 'Aktywna',
    "Data_Anulowania" DATETIME,
    "ID_Uzytkownika" INTEGER NOT NULL,
    "ID_Ksiazki" INTEGER NOT NULL,
    CONSTRAINT "Rezerwacje_ID_Uzytkownika_fkey" FOREIGN KEY ("ID_Uzytkownika") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rezerwacje_ID_Ksiazki_fkey" FOREIGN KEY ("ID_Ksiazki") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "ID_Roli" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StatusyKsiazek" (
    "ID_Statusu_Ksiazki" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StatusyZamowien" (
    "ID_Statusu_Zamowienia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT
);

-- CreateTable
CREATE TABLE "Uzytkownicy" (
    "ID_Uzytkownika" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "Haslo_Hash" TEXT NOT NULL,
    "imie" TEXT,
    "nazwisko" TEXT,
    "Data_Rejestracji" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Czy_Aktywny" BOOLEAN NOT NULL DEFAULT true,
    "Token_Reset_Hasla" TEXT,
    "Data_Wazn_Tokenu" DATETIME,
    "ID_Roli" INTEGER NOT NULL,
    CONSTRAINT "Uzytkownicy_ID_Roli_fkey" FOREIGN KEY ("ID_Roli") REFERENCES "Role" ("ID_Roli") ON DELETE RESTRICT ON UPDATE CASCADE
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
    CONSTRAINT "Zamowienia_ID_Uzytkownika_fkey" FOREIGN KEY ("ID_Uzytkownika") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Adresu_Dostawy_fkey" FOREIGN KEY ("ID_Adresu_Dostawy") REFERENCES "Adresy" ("ID_Adresu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Metody_Dostawy_fkey" FOREIGN KEY ("ID_Metody_Dostawy") REFERENCES "MetodyDostawy" ("ID_Metody_Dostawy") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zamowienia_ID_Statusu_Zamowienia_fkey" FOREIGN KEY ("ID_Statusu_Zamowienia") REFERENCES "StatusyZamowien" ("ID_Statusu_Zamowienia") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZdjeciaKsiazek" (
    "ID_Zdjecia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "Opis_Alt" TEXT,
    "Czy_Glowne" BOOLEAN NOT NULL DEFAULT false,
    "ID_Ksiazki" INTEGER NOT NULL,
    CONSTRAINT "ZdjeciaKsiazek_ID_Ksiazki_fkey" FOREIGN KEY ("ID_Ksiazki") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ZgloszeniaKsiazek" (
    "ID_Zgloszenia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Autor_Tekst" TEXT NOT NULL,
    "Tytul_Tekst" TEXT NOT NULL,
    "Stan_Opis" TEXT NOT NULL,
    "Opis_Dodatkowy" TEXT,
    "Data_Zgloszenia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Status_Zgloszenia" TEXT NOT NULL DEFAULT 'Nowe',
    "Decyzja_Admina_Opis" TEXT,
    "Data_Decyzji" DATETIME,
    "ID_Uzytkownika_Zglaszajacego" INTEGER NOT NULL,
    "ID_Admina_Oceniajacego" INTEGER,
    "ID_Ksiazki_Po_Dodaniu" INTEGER,
    CONSTRAINT "ZgloszeniaKsiazek_ID_Uzytkownika_Zglaszajacego_fkey" FOREIGN KEY ("ID_Uzytkownika_Zglaszajacego") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ZgloszeniaKsiazek_ID_Admina_Oceniajacego_fkey" FOREIGN KEY ("ID_Admina_Oceniajacego") REFERENCES "Uzytkownicy" ("ID_Uzytkownika") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ZgloszeniaKsiazek_ID_Ksiazki_Po_Dodaniu_fkey" FOREIGN KEY ("ID_Ksiazki_Po_Dodaniu") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_KsiazkaAutor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_KsiazkaAutor_A_fkey" FOREIGN KEY ("A") REFERENCES "Autorzy" ("ID_Autora") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KsiazkaAutor_B_fkey" FOREIGN KEY ("B") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_KsiazkaGatunek" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_KsiazkaGatunek_A_fkey" FOREIGN KEY ("A") REFERENCES "Gatunki" ("ID_Gatunku") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_KsiazkaGatunek_B_fkey" FOREIGN KEY ("B") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Gatunki_Nazwa_UN" ON "Gatunki"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "PozZam_Uniq_Zam_Ksiazka" ON "PozycjeZamowien"("ID_Zamowienia", "ID_Ksiazki");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Nazwa_UN" ON "Role"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "StatusyKsiazek_Nazwa_UN" ON "StatusyKsiazek"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "StatusyZamowien_Nazwa_UN" ON "StatusyZamowien"("nazwa");

-- CreateIndex
CREATE UNIQUE INDEX "Uzytkownicy_Email_UN" ON "Uzytkownicy"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Zamowienia_Numer_UN" ON "Zamowienia"("Numer_Zamowienia");

-- CreateIndex
CREATE UNIQUE INDEX "ZgloszKs_Ksiazka_UN" ON "ZgloszeniaKsiazek"("ID_Ksiazki_Po_Dodaniu");

-- CreateIndex
CREATE UNIQUE INDEX "_KsiazkaAutor_AB_unique" ON "_KsiazkaAutor"("A", "B");

-- CreateIndex
CREATE INDEX "_KsiazkaAutor_B_index" ON "_KsiazkaAutor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KsiazkaGatunek_AB_unique" ON "_KsiazkaGatunek"("A", "B");

-- CreateIndex
CREATE INDEX "_KsiazkaGatunek_B_index" ON "_KsiazkaGatunek"("B");
