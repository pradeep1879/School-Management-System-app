/*
  Warnings:

  - You are about to drop the column `classId` on the `StudentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `StudentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `StudentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `studentName` on the `StudentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `StudentInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[infoId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactN` to the `StudentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherName` to the `StudentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentInfo" DROP CONSTRAINT "StudentInfo_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentInfo" DROP CONSTRAINT "StudentInfo_teacherId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "infoId" TEXT;

-- AlterTable
ALTER TABLE "StudentInfo" DROP COLUMN "classId",
DROP COLUMN "isActive",
DROP COLUMN "password",
DROP COLUMN "studentName",
DROP COLUMN "teacherId",
ADD COLUMN     "contactN" TEXT NOT NULL,
ADD COLUMN     "fatherName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_infoId_key" ON "Student"("infoId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "StudentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
