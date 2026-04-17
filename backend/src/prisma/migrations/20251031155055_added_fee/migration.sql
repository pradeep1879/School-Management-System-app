/*
  Warnings:

  - A unique constraint covering the columns `[rollNumber]` on the table `StudentInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentInfo_rollNumber_key" ON "StudentInfo"("rollNumber");

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
