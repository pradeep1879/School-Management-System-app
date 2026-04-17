/*
  Warnings:

  - You are about to drop the column `joinedOn` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "session" TEXT NOT NULL DEFAULT '2025-26';

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "joinedOn",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
