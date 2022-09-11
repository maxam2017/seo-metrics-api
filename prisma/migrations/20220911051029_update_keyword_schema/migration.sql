/*
  Warnings:

  - Added the required column `name` to the `keywords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "keywords" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
