/*
  Warnings:

  - You are about to drop the column `day` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "day",
ADD COLUMN     "adminId" TEXT NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Attendance_classId_date_idx" ON "Attendance"("classId", "date");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
