CREATE TYPE "EventType" AS ENUM ('HOLIDAY', 'EXAM', 'EVENT', 'NOTICE');

CREATE TABLE "Timetable" (
  "id" TEXT NOT NULL,
  "classId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "teacherId" TEXT NOT NULL,
  "room" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalendarEvent" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "type" "EventType" NOT NULL,
  "classId" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Timetable_classId_dayOfWeek_idx" ON "Timetable"("classId", "dayOfWeek");
CREATE INDEX "Timetable_teacherId_dayOfWeek_idx" ON "Timetable"("teacherId", "dayOfWeek");
CREATE INDEX "Timetable_subjectId_idx" ON "Timetable"("subjectId");

CREATE INDEX "CalendarEvent_classId_startDate_idx" ON "CalendarEvent"("classId", "startDate");
CREATE INDEX "CalendarEvent_type_startDate_idx" ON "CalendarEvent"("type", "startDate");
CREATE INDEX "CalendarEvent_createdBy_idx" ON "CalendarEvent"("createdBy");

ALTER TABLE "Timetable"
ADD CONSTRAINT "Timetable_classId_fkey"
FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Timetable"
ADD CONSTRAINT "Timetable_subjectId_fkey"
FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Timetable"
ADD CONSTRAINT "Timetable_teacherId_fkey"
FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CalendarEvent"
ADD CONSTRAINT "CalendarEvent_classId_fkey"
FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CalendarEvent"
ADD CONSTRAINT "CalendarEvent_createdBy_fkey"
FOREIGN KEY ("createdBy") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
