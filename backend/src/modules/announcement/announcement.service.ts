import { client } from "../../prisma/db.ts";
import type { Prisma } from "@prisma/client";
import type { AppRole } from "../../types/auth.types";
import { emitAnnouncementToTargets, sendToUser, type ConnectedClient } from "../../websocket/wsClients.ts";
import { WS_EVENTS, type AnnouncementTargetType } from "../../websocket/wsEvents.ts";

type CreateAnnouncementInput = {
  title: string;
  message: string;
  targetType: AnnouncementTargetType;
  classId?: string | null;
};

type ListQuery = {
  page?: string | number;
  limit?: string | number;
};

const toPositiveNumber = (value: string | number | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getTeacherClassId = async (teacherId: string) => {
  const teacherClass = await client.class.findFirst({
    where: { teacherId },
    select: { id: true },
  });

  return teacherClass?.id ?? null;
};

const getStudentClassId = async (studentId: string) => {
  const student = await client.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  return student?.classId ?? null;
};

const getSenderName = async (senderId: string, senderRole: AppRole) => {
  if (senderRole === "admin") {
    const admin = await client.admin.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    return admin?.name ?? "Admin";
  }

  if (senderRole === "teacher") {
    const teacher = await client.teacher.findUnique({
      where: { id: senderId },
      select: { teacherName: true },
    });

    return teacher?.teacherName ?? "Teacher";
  }

  const student = await client.student.findUnique({
    where: { id: senderId },
    select: { studentName: true },
  });

  return student?.studentName ?? "Student";
};

const withAnnouncementMeta = async (announcement: any, userId?: string) => {
  const senderName = await getSenderName(announcement.senderId, announcement.senderRole);
  const isRead = userId ? Boolean(announcement.reads?.length) : false;
  const { reads, ...safeAnnouncement } = announcement;
  void reads;

  return {
    ...safeAnnouncement,
    senderName,
    isRead,
  };
};

const ensureClassExists = async (classId: string) => {
  const classRecord = await client.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });

  if (!classRecord) {
    throw new Error("Class not found");
  }
};

const canReceiveAnnouncement = (
  announcement: { targetType: AnnouncementTargetType; classId: string | null; senderRole: AppRole },
  connectedClient: ConnectedClient,
) => {
  if (announcement.targetType === "SCHOOL") {
    return true;
  }

  if (announcement.targetType === "TEACHERS") {
    return connectedClient.role === "teacher";
  }

  if (!announcement.classId || connectedClient.classId !== announcement.classId) {
    return false;
  }

  if (announcement.senderRole === "teacher") {
    return connectedClient.role === "student";
  }

  return connectedClient.role === "student" || connectedClient.role === "teacher";
};

const getVisibleWhere = async (
  userId: string,
  role: AppRole,
): Promise<Prisma.AnnouncementWhereInput> => {
  if (role === "admin") {
    return {};
  }

  if (role === "teacher") {
    const classId = await getTeacherClassId(userId);

    return {
      OR: [
        { targetType: "SCHOOL" as const },
        { targetType: "TEACHERS" as const },
        { senderId: userId },
        ...(classId ? [{ targetType: "CLASS" as const, classId }] : []),
      ],
    };
  }

  const classId = await getStudentClassId(userId);

  return {
    OR: [
      { targetType: "SCHOOL" as const },
      ...(classId ? [{ targetType: "CLASS" as const, classId }] : []),
    ],
  };
};

export const createAnnouncement = async (
  body: CreateAnnouncementInput,
  senderId: string,
  senderRole: AppRole,
) => {
  if (senderRole === "student") {
    throw new Error("Students cannot create announcements");
  }

  let targetType = body.targetType;
  let classId = body.classId ?? null;

  if (senderRole === "teacher") {
    targetType = "CLASS";
    classId = await getTeacherClassId(senderId);

    if (!classId) {
      throw new Error("No class assigned to this teacher");
    }
  }

  if (senderRole === "admin" && targetType === "CLASS") {
    if (!classId) {
      throw new Error("Class is required for class announcements");
    }

    await ensureClassExists(classId);
  }

  if (targetType !== "CLASS") {
    classId = null;
  }

  const announcement = await client.$transaction(async (tx) => {
    const created = await tx.announcement.create({
      data: {
        title: body.title,
        message: body.message,
        senderId,
        senderRole,
        targetType,
        classId,
      },
    });

    await tx.announcementRead.create({
      data: {
        announcementId: created.id,
        userId: senderId,
      },
    });

    return created;
  });

  const payload = await withAnnouncementMeta({ ...announcement, reads: [{ id: senderId }] }, senderId);
  emitAnnouncementToTargets(
    payload,
    (connectedClient) =>
      connectedClient.userId === senderId ||
      canReceiveAnnouncement(
        {
          targetType,
          classId,
          senderRole,
        },
        connectedClient,
      ),
    (connectedClient) => ({
      ...payload,
      isRead: connectedClient.userId === senderId,
    }),
  );

  return {
    success: true,
    message: "Announcement created successfully",
    announcement: payload,
  };
};

export const getAnnouncements = async (
  userId: string,
  role: AppRole,
  query: ListQuery,
) => {
  const page = toPositiveNumber(query.page, 1);
  const limit = Math.min(toPositiveNumber(query.limit, 20), 50);
  const skip = (page - 1) * limit;
  const where = await getVisibleWhere(userId, role);

  const [announcements, total, unreadCount] = await Promise.all([
    client.announcement.findMany({
      where,
      skip,
      take: limit,
      include: {
        reads: {
          where: { userId },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    client.announcement.count({ where }),
    client.announcement.count({
      where: {
        ...where,
        reads: {
          none: { userId },
        },
      },
    }),
  ]);

  return {
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    unreadCount,
    announcements: await Promise.all(
      announcements.map((announcement) => withAnnouncementMeta(announcement, userId)),
    ),
  };
};

export const markAnnouncementRead = async (
  announcementId: string,
  userId: string,
  role: AppRole,
) => {
  const visibleWhere = await getVisibleWhere(userId, role);
  const announcement = await client.announcement.findFirst({
    where: {
      id: announcementId,
      ...visibleWhere,
    },
    select: { id: true },
  });

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  const read = await client.announcementRead.upsert({
    where: {
      announcementId_userId: {
        announcementId,
        userId,
      },
    },
    create: {
      announcementId,
      userId,
    },
    update: {},
  });

  sendToUser(userId, {
    event: WS_EVENTS.ANNOUNCEMENT_READ,
    payload: {
      announcementId,
      readAt: read.readAt,
    },
  });

  return {
    success: true,
    message: "Announcement marked as read",
    read,
  };
};
