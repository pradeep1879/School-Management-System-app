/*
  Warnings:

  - A unique constraint covering the columns `[examId,subjectId]` on the table `ExamSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamSubject_examId_subjectId_key" ON "ExamSubject"("examId", "subjectId");
