import { client } from "../../prisma/db.ts";

export const createSubject = async (body, userId) => {
  const { name, code, periods, room, classId, teacherId } = body;

  if (!name || !classId) {
    throw new Error("Name and classId are required");
  }

  const existing = await client.subject.findFirst({
    where: {
      name,
      classId,
    },
  });

  if (existing) {
    throw new Error("Subject already exists for this class");
  }

  const subject = await client.subject.create({
    data: {
      name,
      code,
      teacherId,
      periods: parseFloat(periods),
      room: parseFloat(room),
      classId,
    },
  });

  return {
    success: true,
    message: "Subject created successfully",
    subject,
  };
};

export const getAllSubjects = async (query) => {
  const { classId } = query;

  const subjects = await client.subject.findMany({
    where: classId ? { classId } : {},
    select: {
      id: true,
      name: true,
      periods: true,
      room: true,
      code: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
        },
      },
      teacher: {
        select: {
          id: true,
          teacherName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    subjects,
  };
};

export const getSubjectById = async (id) => {
  const subject = await client.subject.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
        },
      },
      teacher: {
        select: {
          id: true,
          teacherName: true,
          email: true,
        },
      },
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  return {
    success: true,
    subject,
  };
};


export const deleteSubject = async (id) => {
  await client.subject.delete({
    where: { id },
  });
  
  return {
    success: true,
    message: "Subject deleted successfully",
  };
};

export const assignTeacherToSubject = async (subjectId, teacherId) => {
  const subject = await client.subject.update({
    where: { id: subjectId },
    data: {
      teacherId,
    },
  });

  return {
    success: true,
    message: "Teacher assigned successfully",
    subject,
  };
};