import { client } from "../../prisma/db.ts";

export const createHomework = async (body, userId, role) => {
  const { title, dueDate, classId, subjects } = body;

  if (!title || !dueDate || !classId || !subjects?.length) {
    throw new Error("All required fields must be provided");
  }

  if (role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const homework = await client.homework.create({
    data: {
      title,
      dueDate: new Date(dueDate),
      classId,
      teacherId: userId,
      subjects: {
        create: subjects.map((sub) => ({
          subjectId: sub.subjectId,
          description: sub.description, //  per subject
        })),
      },
    },
  });

  return {
    message: "Homework created successfully",
    homework,
  };
};

export const getHomeworkByClass = async (classId) => {
  if (!classId) {
    throw new Error("Class ID required");
  }

  const homework = await client.homework.findMany({
    where: { classId },
    include: {
      subjects: {
        include: {
          subject: true,
        },
      },
      teacher: {
        select: {
          teacherName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    homework,
  };
};

export const updateHomeworkStatus = async (
  homeworkId,
  status,
  userId,
  role
) => {
  if (role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const homework = await client.homework.findUnique({
    where: { id: homeworkId },
  });

  if (!homework) {
    throw new Error("Homework not found");
  }

  if (homework.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await client.homework.update({
    where: { id: homeworkId },
    data: { status },
  });

  return {
    message: "Homework status updated",
    homework: updated,
  };
};

export const deleteHomework = async (
  homeworkId,
  userId,
  role
) => {
  if (role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const homework = await client.homework.findUnique({
    where: { id: homeworkId },
  });

  if (!homework) {
    throw new Error("Homework not found");
  }

  if (homework.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  await client.homework.delete({
    where: { id: homeworkId },
  });

  return {
    message: "Homework deleted successfully",
  };
};