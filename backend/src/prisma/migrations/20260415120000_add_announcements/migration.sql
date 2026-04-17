CREATE TYPE "Role" AS ENUM ('admin', 'teacher', 'student');

CREATE TYPE "TargetType" AS ENUM ('SCHOOL', 'CLASS', 'TEACHERS');

CREATE TABLE "Announcement" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "senderRole" "Role" NOT NULL,
  "targetType" "TargetType" NOT NULL,
  "classId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AnnouncementRead" (
  "id" TEXT NOT NULL,
  "announcementId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnnouncementRead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Announcement_targetType_idx" ON "Announcement"("targetType");
CREATE INDEX "Announcement_classId_idx" ON "Announcement"("classId");
CREATE INDEX "Announcement_senderId_idx" ON "Announcement"("senderId");
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");

CREATE UNIQUE INDEX "AnnouncementRead_announcementId_userId_key" ON "AnnouncementRead"("announcementId", "userId");
CREATE INDEX "AnnouncementRead_userId_idx" ON "AnnouncementRead"("userId");

ALTER TABLE "Announcement"
  ADD CONSTRAINT "Announcement_classId_fkey"
  FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AnnouncementRead"
  ADD CONSTRAINT "AnnouncementRead_announcementId_fkey"
  FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
