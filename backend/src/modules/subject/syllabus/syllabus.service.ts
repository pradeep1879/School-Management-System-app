import { client } from "../../../prisma/db.ts";

/* Create Chapter */
export const createChapter = async (body, role) => {
  const { subjectId, title, description, order } = body;

  if (!subjectId || !title) {
    throw new Error("SubjectId and title required");
  }

  if (role !== "admin" && role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const chapter = await client.syllabusChapter.create({
    data: {
      subjectId,
      title,
      description,
      order: Number(order) || 0,
    },
  });

  return {
    success: true,
    chapter,
  };
};

export const createChaptersBulk = async (body, role) => {
  const { subjectId, chapters } = body;

  if (!subjectId || !chapters || !Array.isArray(chapters)) {
    throw new Error("Invalid payload");
  }

  if (role !== "admin" && role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const created = await client.syllabusChapter.createMany({
    data: chapters.map((chapter, index) => ({
      subjectId,
      title: chapter.title,
      description: chapter.description,
      order: index,
      status: "PENDING",
    })),
  });

  return {
    success: true,
    message: "Syllabus created successfully",
    count: created.count,
  };
};

/* Get Chapters By Subject */
export const getChaptersBySubject = async (subjectId) => {
  if (!subjectId) {
    throw new Error("Subject ID required");
  }

  const chapters = await client.syllabusChapter.findMany({
    where: { subjectId },
    orderBy: { order: "asc" },
  });

  return {
    success: true,
    chapters,
  };
};


/* Update Chapter Status */
export const updateChapterStatus = async (
  chapterId,
  status,
  role
) => {
  const allowed = ["PENDING", "ONGOING", "COMPLETED"];

  if (!allowed.includes(status)) {
    throw new Error("Invalid status");
  }

  if (role !== "admin" && role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const chapter = await client.syllabusChapter.update({
    where: { id: chapterId },
    data: { status },
  });

  return {
    success: true,
    chapter,
  };
};


/* Delete Chapter */
export const deleteChapter = async (chapterId, role) => {
  if (role !== "admin" && role !== "teacher") {
    throw new Error("Unauthorized");
  }

  await client.syllabusChapter.delete({
    where: { id: chapterId },
  });

  return {
    success: true,
    message: "Chapter deleted",
  };
};