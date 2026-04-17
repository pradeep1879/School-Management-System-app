/*
  Warnings:

  - You are about to drop the column `rollNumber` on the `StudentInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classId,rollNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rollNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."StudentInfo_studentId_rollNumber_key";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "rollNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StudentInfo" DROP COLUMN "rollNumber";

-- CreateIndex
CREATE UNIQUE INDEX "Student_classId_rollNumber_key" ON "Student"("classId", "rollNumber");
