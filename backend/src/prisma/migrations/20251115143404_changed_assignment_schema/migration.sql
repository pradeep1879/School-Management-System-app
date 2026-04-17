/*
  Warnings:

  - Added the required column `day` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "day" TEXT NOT NULL,
ALTER COLUMN "createdOn" SET DATA TYPE TEXT;
