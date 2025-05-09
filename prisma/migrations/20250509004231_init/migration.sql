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
    "ID_Ksiazki" INTEGER NOT NULL,
    CONSTRAINT "PozycjeKoszyka_ID_Koszyka_fkey" FOREIGN KEY ("ID_Koszyka") REFERENCES "Koszyki" ("ID_Koszyka") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PozycjeKoszyka_ID_Ksiazki_fkey" FOREIGN KEY ("ID_Ksiazki") REFERENCES "Ksiazki" ("ID_Ksiazki") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Koszyki_ID_Uzytkownika_key" ON "Koszyki"("ID_Uzytkownika");

-- CreateIndex
CREATE UNIQUE INDEX "PozKosz_Uniq_Kosz_Ksiazka" ON "PozycjeKoszyka"("ID_Koszyka", "ID_Ksiazki");
