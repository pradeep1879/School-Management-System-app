/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "dueDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
