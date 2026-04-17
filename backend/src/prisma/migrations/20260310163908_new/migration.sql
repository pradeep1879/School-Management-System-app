-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TeacherAttendance" ALTER COLUMN "checkInTime" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "checkOutTime" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Attendance_sessionId_idx" ON "Attendance"("sessionId");
