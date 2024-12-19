-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "primaryDriver" TEXT,
    "mailingAddress" TEXT,
    "garagingAddress" TEXT,
    "vehicles" TEXT,
    "additionalDrivers" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "quote" INTEGER
);
