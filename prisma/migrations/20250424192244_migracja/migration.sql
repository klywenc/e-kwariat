/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Haslo_Hash` on the `Uzytkownicy` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Roli` on the `Uzytkownicy` table. All the data in the column will be lost.
  - You are about to drop the column `imie` on the `Uzytkownicy` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Uzytkownicy` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Role_Nazwa_UN";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Role";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uzytkownicy" (
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
INSERT INTO "new_Uzytkownicy" ("Czy_Aktywny", "Data_Rejestracji", "Data_Wazn_Tokenu", "ID_Uzytkownika", "Token_Reset_Hasla", "email", "nazwisko") SELECT "Czy_Aktywny", "Data_Rejestracji", "Data_Wazn_Tokenu", "ID_Uzytkownika", "Token_Reset_Hasla", "email", "nazwisko" FROM "Uzytkownicy";
DROP TABLE "Uzytkownicy";
ALTER TABLE "new_Uzytkownicy" RENAME TO "Uzytkownicy";
CREATE UNIQUE INDEX "Uzytkownicy_Email_UN" ON "Uzytkownicy"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
