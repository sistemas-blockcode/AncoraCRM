/*
  Warnings:

  - A unique constraint covering the columns `[storeId,weekStartDate]` on the table `WeeklySummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WeeklySummary_storeId_weekStartDate_key" ON "WeeklySummary"("storeId", "weekStartDate");
