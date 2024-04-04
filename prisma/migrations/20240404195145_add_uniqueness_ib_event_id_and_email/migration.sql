/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `Attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendees_event_id_email_key" ON "Attendees"("event_id", "email");
