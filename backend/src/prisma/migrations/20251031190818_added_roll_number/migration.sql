/*
  Warnings:

  - A unique constraint covering the columns `[studentId,rollNumber]` on the table `StudentInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_teacherId_fkey";

-- DropIndex
DROP INDEX "public"."StudentInfo_rollNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentInfo_studentId_rollNumber_key" ON "StudentInfo"("studentId", "rollNumber");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
