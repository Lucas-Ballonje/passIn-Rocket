-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" TEXT NOT NULL,
    CONSTRAINT "Attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendees" ("created_at", "email", "event_id", "id", "name") SELECT "created_at", "email", "event_id", "id", "name" FROM "Attendees";
DROP TABLE "Attendees";
ALTER TABLE "new_Attendees" RENAME TO "Attendees";
CREATE UNIQUE INDEX "Attendees_event_id_email_key" ON "Attendees"("event_id", "email");
CREATE TABLE "new_check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" INTEGER NOT NULL,
    CONSTRAINT "check_ins_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Attendees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_check_ins" ("created_at", "event_id", "id") SELECT "created_at", "event_id", "id" FROM "check_ins";
DROP TABLE "check_ins";
ALTER TABLE "new_check_ins" RENAME TO "check_ins";
CREATE UNIQUE INDEX "check_ins_event_id_key" ON "check_ins"("event_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
