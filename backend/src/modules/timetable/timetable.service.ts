import { client } from "../../prisma/db.ts";
import type { AppRole } from "../../types/auth.types.ts";

type TimetableInput = {
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room?: string | null;
};

const createHttpError = (message: string, statusCode = 400) => {
  const error = new Error(message) as Error & {
    statusCode?: number;
  };
  error.statusCode = statusCode;
  return error;
};

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const validateTimeRange = (startTime: string, endTime: string) => {
  if (toMinutes(startTime) >= toMinutes(endTime)) {
    throw createHttpError("End time must be later than start time");
  }
};

const isOverlap = (
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
) => {
  return (
    toMinutes(leftStart) < toMinutes(rightEnd) &&
    toMinutes(rightStart) < toMinutes(leftEnd)
  );
};

const getClassForAdmin = async (classId: string, adminId: string) => {
  const classRecord = await client.class.findFirst({
    where: {
      id: classId,
      adminId,
    },
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
      adminId: true,
      teacherId: true,
    },
  });

  if (!classRecord) {
    throw createHttpError("Class not found", 404);
  }

  return classRecord;
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

const ensureReadableClass = async (
  classId: string,
  role: AppRole,
  userId: string,
) => {
  if (role === "admin") {
    return getClassForAdmin(classId, userId);
  }

  if (role === "teacher") {
    const classIds = await getTeacherRelatedClassIds(userId);

    if (!classIds.includes(classId)) {
      throw createHttpError("Unauthorized access to this timetable", 403);
    }

    return client.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        slug: true,
        section: true,
        session: true,
      },
    });
  }

  const student = await client.student.findUnique({
    where: { id: userId },
    select: {
      classId: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student || student.classId !== classId) {
    throw createHttpError("Unauthorized access to this timetable", 403);
  }

  return student.class;
};

const ensureTimetableDependencies = async (
  input: TimetableInput,
  adminId: string,
  excludeId?: string,
) => {
  validateTimeRange(input.startTime, input.endTime);

  const [classRecord, subject, teacher] = await Promise.all([
    getClassForAdmin(input.classId, adminId),
    client.subject.findUnique({
      where: { id: input.subjectId },
      select: {
        id: true,
        classId: true,
        teacherId: true,
        name: true,
      },
    }),
    client.teacher.findFirst({
      where: {
        id: input.teacherId,
        adminId,
      },
      select: {
        id: true,
        teacherName: true,
      },
    }),
  ]);

  if (!subject || subject.classId !== input.classId) {
    throw createHttpError("Selected subject does not belong to this class");
  }

  if (!teacher) {
    throw createHttpError("Selected teacher is invalid");
  }

  if (subject.teacherId && subject.teacherId !== input.teacherId) {
    throw createHttpError(
      "Selected teacher must match the teacher assigned to the subject",
    );
  }

  const classConflicts = await client.timetable.findMany({
    where: {
      classId: input.classId,
      dayOfWeek: input.dayOfWeek,
      id: excludeId ? { not: excludeId } : undefined,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });

  if (
    classConflicts.some((slot) =>
      isOverlap(
        input.startTime,
        input.endTime,
        slot.startTime,
        slot.endTime,
      ),
    )
  ) {
    throw createHttpError("This class already has another subject in that time range");
  }

  const teacherConflicts = await client.timetable.findMany({
    where: {
      teacherId: input.teacherId,
      dayOfWeek: input.dayOfWeek,
      id: excludeId ? { not: excludeId } : undefined,
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });

  if (
    teacherConflicts.some((slot) =>
      isOverlap(
        input.startTime,
        input.endTime,
        slot.startTime,
        slot.endTime,
      ),
    )
  ) {
    throw createHttpError("This teacher is already assigned to another class at that time");
  }

  return {
    classRecord,
    subject,
    teacher,
  };
};

const timetableSelect = {
  id: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  room: true,
  createdAt: true,
  class: {
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
      code: true,
      room: true,
    },
  },
  teacher: {
    select: {
      id: true,
      teacherName: true,
      email: true,
      imageUrl: true,
    },
  },
} as const;

export const createTimetableSlot = async (
  input: TimetableInput,
  adminId: string,
) => {
  await ensureTimetableDependencies(input, adminId);

  const timetable = await client.timetable.create({
    data: {
      classId: input.classId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      subjectId: input.subjectId,
      teacherId: input.teacherId,
      room: input.room?.trim() || null,
    },
    select: timetableSelect,
  });

  return {
    success: true,
    message: "Timetable slot created successfully",
    timetable,
  };
};

export const updateTimetableSlot = async (
  slotId: string,
  input: TimetableInput,
  adminId: string,
) => {
  const existing = await client.timetable.findUnique({
    where: { id: slotId },
    select: {
      id: true,
      class: {
        select: {
          adminId: true,
        },
      },
    },
  });

  if (!existing) {
    throw createHttpError("Timetable slot not found", 404);
  }

  if (existing.class.adminId !== adminId) {
    throw createHttpError("Unauthorized", 403);
  }

  await ensureTimetableDependencies(input, adminId, slotId);

  const timetable = await client.timetable.update({
    where: { id: slotId },
    data: {
      classId: input.classId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      subjectId: input.subjectId,
      teacherId: input.teacherId,
      room: input.room?.trim() || null,
    },
    select: timetableSelect,
  });

  return {
    success: true,
    message: "Timetable slot updated successfully",
    timetable,
  };
};

export const deleteTimetableSlot = async (
  slotId: string,
  adminId: string,
) => {
  const existing = await client.timetable.findUnique({
    where: { id: slotId },
    select: {
      id: true,
      class: {
        select: {
          adminId: true,
        },
      },
    },
  });

  if (!existing) {
    throw createHttpError("Timetable slot not found", 404);
  }

  if (existing.class.adminId !== adminId) {
    throw createHttpError("Unauthorized", 403);
  }

  await client.timetable.delete({
    where: { id: slotId },
  });

  return {
    success: true,
    message: "Timetable slot deleted successfully",
  };
};

export const getTimetableByClass = async (
  classId: string,
  role: AppRole,
  userId: string,
) => {
  const classRecord = await ensureReadableClass(classId, role, userId);

  const slots = await client.timetable.findMany({
    where: {
      classId,
    },
    select: timetableSelect,
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return {
    success: true,
    class: classRecord,
    slots,
  };
};

export const getMyTimetable = async (
  role: AppRole,
  userId: string,
) => {
  if (role === "teacher") {
    const slots = await client.timetable.findMany({
      where: {
        teacherId: userId,
      },
      select: timetableSelect,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    const classRecord = await getTeacherPrimaryClass(userId);

    return {
      success: true,
      class: classRecord ?? null,
      slots,
    };
  }

  const student = await client.student.findUnique({
    where: { id: userId },
    select: {
      classId: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student) {
    throw createHttpError("Student not found", 404);
  }

  const slots = await client.timetable.findMany({
    where: {
      classId: student.classId,
    },
    select: timetableSelect,
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return {
    success: true,
    class: student.class,
    slots,
  };
};
