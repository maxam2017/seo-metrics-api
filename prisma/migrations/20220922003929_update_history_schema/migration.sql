/*
  Warnings:

  - A unique constraint covering the columns `[hashCode]` on the table `histories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashCode` to the `histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "histories" ADD COLUMN     "hashCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "histories_hashCode_key" ON "histories"("hashCode");
