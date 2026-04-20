import { client } from "../../prisma/db.ts";
import type { AppRole } from "../../types/auth.types.ts";

type CalendarEventInput = {
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  type: "HOLIDAY" | "EXAM" | "EVENT" | "NOTICE";
  classId?: string | null;
};

type CalendarListQuery = {
  startDate?: string;
  endDate?: string;
  classId?: string;
  type?: "HOLIDAY" | "EXAM" | "EVENT" | "NOTICE";
};

const createHttpError = (message: string, statusCode = 400) => {
  const error = new Error(message) as Error & {
    statusCode?: number;
  };
  error.statusCode = statusCode;
  return error;
};

const eventSelect = {
  id: true,
  title: true,
  description: true,
  startDate: true,
  endDate: true,
  type: true,
  classId: true,
  createdAt: true,
  updatedAt: true,
  class: {
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
    },
  },
  admin: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const;

const ensureCalendarDates = (input: CalendarEventInput) => {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError("Invalid event dates");
  }

  if (startDate.getTime() > endDate.getTime()) {
    throw createHttpError("End date must be after start date");
  }

  return {
    startDate,
    endDate,
  };
};

const getTeacherRelatedClassIds = async (teacherId: string) => {
  const classes = await client.class.findMany({
    where: {
      OR: [
        { teacherId },
        { subjects: { some: { teacherId } } },
        { timetableSlots: { some: { teacherId } } },
      ],
    },
    select: {
      id: true,
    },
  });

  return classes.map((item) => item.id);
};

const getTeacherPrimaryClass = async (teacherId: string) => {
  const assignedClass = await client.class.findFirst({
    where: {
      teacherId,
    },
    select: {
      id: true,
      adminId: true,
      slug: true,
      section: true,
      session: true,
    },
    orderBy: [
      { session: "desc" },
      { slug: "asc" },
      { section: "asc" },
    ],
  });

  if (assignedClass) {
    return assignedClass;
  }

  return client.class.findFirst({
    where: {
      OR: [
        { subjects: { some: { teacherId } } },
        { timetableSlots: { some: { teacherId } } },
      ],
    },
    select: {
      id: true,
      adminId: true,
      slug: true,
      section: true,
      session: true,
    },
    orderBy: [
      { session: "desc" },
      { slug: "asc" },
      { section: "asc" },
    ],
  });
};

const getTeacherRelatedAdminIds = async (teacherId: string) => {
  const classes = await client.class.findMany({
    where: {
      OR: [
        { teacherId },
        { subjects: { some: { teacherId } } },
        { timetableSlots: { some: { teacherId } } },
      ],
    },
    select: {
      adminId: true,
    },
    distinct: ["adminId"],
  });

  return classes
    .map((item) => item.adminId)
    .filter((value): value is string => Boolean(value));
};

const getStudentClassId = async (studentId: string) => {
  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      classId: true,
      class: {
        select: {
          adminId: true,
        },
      },
    },
  });

  return {
    classId: student?.classId ?? null,
    adminId: student?.class?.adminId ?? null,
  };
};

const ensureAdminClassAccess = async (classId: string, adminId: string) => {
  const classRecord = await client.class.findFirst({
    where: {
      id: classId,
      adminId,
    },
    select: {
      id: true,
    },
  });

  if (!classRecord) {
    throw createHttpError("Class not found", 404);
  }
};

const getVisibleCalendarWhere = async (
  role: AppRole,
  userId: string,
  query: CalendarListQuery,
) => {
  const startDate = query.startDate ? new Date(query.startDate) : null;
  const endDate = query.endDate ? new Date(query.endDate) : null;

  const dateWhere =
    startDate || endDate
      ? {
          AND: [
            ...(endDate ? [{ startDate: { lte: endDate } }] : []),
            ...(startDate ? [{ endDate: { gte: startDate } }] : []),
          ],
        }
      : {};

  if (role === "admin") {
    if (query.classId) {
      await ensureAdminClassAccess(query.classId, userId);
    }

    return {
      createdBy: userId,
      ...(query.classId && { classId: query.classId }),
      ...(query.type && { type: query.type }),
      ...dateWhere,
    };
  }

  if (role === "teacher") {
    const primaryClass = await getTeacherPrimaryClass(userId);
    const classIds = primaryClass
      ? [primaryClass.id]
      : await getTeacherRelatedClassIds(userId);
    const adminIds = primaryClass?.adminId
      ? [primaryClass.adminId]
      : await getTeacherRelatedAdminIds(userId);

    if (query.classId && !classIds.includes(query.classId)) {
      throw createHttpError("Unauthorized access to class calendar", 403);
    }

    return {
      ...(query.type && { type: query.type }),
      ...dateWhere,
      OR: [
        ...(adminIds.length
          ? adminIds.map((adminId) => ({
              classId: null,
              createdBy: adminId,
            }))
          : []),
        ...(query.classId
          ? [{ classId: query.classId }]
          : classIds.map((classId) => ({ classId }))),
      ],
    };
  }

  const { classId, adminId } = await getStudentClassId(userId);

  if (!classId) {
    throw createHttpError("Student class not found", 404);
  }

  if (query.classId && query.classId !== classId) {
    throw createHttpError("Unauthorized access to class calendar", 403);
  }

    return {
      ...(query.type && { type: query.type }),
      ...dateWhere,
      OR: [
        ...(adminId ? [{ classId: null, createdBy: adminId }] : []),
        { classId },
      ],
    };
};

export const createCalendarEvent = async (
  input: CalendarEventInput,
  adminId: string,
) => {
  const { startDate, endDate } = ensureCalendarDates(input);

  if (input.classId) {
    await ensureAdminClassAccess(input.classId, adminId);
  }

  const event = await client.calendarEvent.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      startDate,
      endDate,
      type: input.type,
      classId: input.classId || null,
      createdBy: adminId,
    },
    select: eventSelect,
  });

  return {
    success: true,
    message: "Calendar event created successfully",
    event,
  };
};

export const updateCalendarEvent = async (
  eventId: string,
  input: CalendarEventInput,
  adminId: string,
) => {
  const existing = await client.calendarEvent.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      createdBy: true,
    },
  });

  if (!existing) {
    throw createHttpError("Calendar event not found", 404);
  }

  if (existing.createdBy !== adminId) {
    throw createHttpError("Unauthorized", 403);
  }

  const { startDate, endDate } = ensureCalendarDates(input);

  if (input.classId) {
    await ensureAdminClassAccess(input.classId, adminId);
  }

  const event = await client.calendarEvent.update({
    where: { id: eventId },
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      startDate,
      endDate,
      type: input.type,
      classId: input.classId || null,
    },
    select: eventSelect,
  });

  return {
    success: true,
    message: "Calendar event updated successfully",
    event,
  };
};

export const deleteCalendarEvent = async (
  eventId: string,
  adminId: string,
) => {
  const existing = await client.calendarEvent.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      createdBy: true,
    },
  });

  if (!existing) {
    throw createHttpError("Calendar event not found", 404);
  }

  if (existing.createdBy !== adminId) {
    throw createHttpError("Unauthorized", 403);
  }

  await client.calendarEvent.delete({
    where: { id: eventId },
  });

  return {
    success: true,
    message: "Calendar event deleted successfully",
  };
};

export const getCalendarEvents = async (
  role: AppRole,
  userId: string,
  query: CalendarListQuery,
) => {
  const where = await getVisibleCalendarWhere(role, userId, query);

  const events = await client.calendarEvent.findMany({
    where,
    select: eventSelect,
    orderBy: [{ startDate: "asc" }, { createdAt: "asc" }],
  });

  return {
    success: true,
    events,
  };
};

export const getCalendarEventsByClass = async (
  classId: string,
  role: AppRole,
  userId: string,
) => {
  return getCalendarEvents(role, userId, { classId });
};
