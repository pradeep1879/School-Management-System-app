/*
  Warnings:

  - You are about to drop the `StudentInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactNo` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatherName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentInfo" DROP CONSTRAINT "StudentInfo_studentId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "fatherName" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."StudentInfo";
