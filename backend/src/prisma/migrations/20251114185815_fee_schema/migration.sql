/*
  Warnings:

  - You are about to drop the column `isPaid` on the `Fee` table. All the data in the column will be lost.
  - Added the required column `remark` to the `Fee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fee" DROP COLUMN "isPaid",
ADD COLUMN     "remark" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE TEXT;
