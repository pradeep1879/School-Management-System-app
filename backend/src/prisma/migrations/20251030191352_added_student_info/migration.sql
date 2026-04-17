/*
  Warnings:

  - You are about to drop the column `infoId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `StudentInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `StudentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_infoId_fkey";

-- DropIndex
DROP INDEX "public"."Student_infoId_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "infoId";

-- AlterTable
ALTER TABLE "StudentInfo" ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentInfo_studentId_key" ON "StudentInfo"("studentId");

-- AddForeignKey
ALTER TABLE "StudentInfo" ADD CONSTRAINT "StudentInfo_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
