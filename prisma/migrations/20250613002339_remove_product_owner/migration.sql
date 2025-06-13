/*
  Warnings:

  - You are about to drop the column `ID_Wlasciciela` on the `Produkty` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produkty" (
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
    CONSTRAINT "Produkty_typProduktuId_fkey" FOREIGN KEY ("typProduktuId") REFERENCES "TypyProduktow" ("ID_Typu_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Produkty_ID_Statusu_Produktu_fkey" FOREIGN KEY ("ID_Statusu_Produktu") REFERENCES "StatusyProduktow" ("ID_Statusu_Produktu") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Produkty" ("Czy_Nowosc", "Czy_Polecany", "Data_Dodania", "Data_Modyfikacji", "ID_Produktu", "ID_Statusu_Produktu", "Kod_EAN_ISBN", "cena", "opis", "opisStanu", "typProduktuId", "tytul") SELECT "Czy_Nowosc", "Czy_Polecany", "Data_Dodania", "Data_Modyfikacji", "ID_Produktu", "ID_Statusu_Produktu", "Kod_EAN_ISBN", "cena", "opis", "opisStanu", "typProduktuId", "tytul" FROM "Produkty";
DROP TABLE "Produkty";
ALTER TABLE "new_Produkty" RENAME TO "Produkty";
CREATE UNIQUE INDEX "Produkty_Kod_EAN_ISBN_key" ON "Produkty"("Kod_EAN_ISBN");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
