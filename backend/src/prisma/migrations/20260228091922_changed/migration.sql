/*
  Warnings:

  - You are about to drop the column `addmissionDate` on the `Student` table. All the data in the column will be lost.
  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "addmissionDate",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "admissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
