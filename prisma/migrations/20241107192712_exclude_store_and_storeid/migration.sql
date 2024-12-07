/*
  Warnings:

  - You are about to drop the column `storeId` on the `WeeklySummary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,weekStartDate]` on the table `WeeklySummary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WeeklySummary" DROP CONSTRAINT "WeeklySummary_storeId_fkey";

-- DropIndex
DROP INDEX "WeeklySummary_storeId_weekStartDate_key";

-- AlterTable
ALTER TABLE "WeeklySummary" DROP COLUMN "storeId";

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySummary_userId_weekStartDate_key" ON "WeeklySummary"("userId", "weekStartDate");
