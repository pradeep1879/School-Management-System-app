// @ts-nocheck
import { client } from "../../prisma/db.ts";
import { buildUpdateData } from "../../utils/updateData.ts";
import { normalizeAcademicSession } from "../../utils/session.ts";

export const createClass = async (body, adminId) => {
  const { slug, section, teacherId } = body;
  const session = normalizeAcademicSession(body.session);

  // Duplicate check
  const existingClass = await client.class.findFirst({
    where: { slug, section, session, adminId },
  });

  if (existingClass) {
    throw new Error("Class already exists");
  }

  const newClass = await client.class.create({
    data: {
      slug,
      section,
      session,
      teacherId: teacherId || null,
      adminId,
    },
  });

  return {
    message: "Class created successfully",
    newClass,
  };
};

export const updateClass = async(body, adminId, classId) =>{
  if (!classId) {
    throw new Error("Class ID is required");
  }
  const existingClass = await client.class.findFirst({
    where:{
      id: classId
    },
    select:{
      id: true,
      adminId: true,
      slug: true,
      section: true,
      session: true,
      _count: {
        select: {
          students: true,
          feeStructures: true,
        },
      },
    }
  });

  if(!existingClass){
    throw new Error("Class doesn't exits")
  }

  if(existingClass.adminId !== adminId){
    throw new Error("Unauthorized");
  }

  const updateData = buildUpdateData(body);

  if (updateData.session) {
    updateData.session = normalizeAcademicSession(
      updateData.session
    );
  }

  const nextSlug = updateData.slug ?? existingClass.slug;
  const nextSection =
    updateData.section ?? existingClass.section;
  const nextSession =
    updateData.session ?? existingClass.session;

  const duplicateClass = await client.class.findFirst({
    where: {
      id: {
        not: classId,
      },
      adminId,
      slug: nextSlug,
      section: nextSection,
      session: nextSession,
    },
    select: {
      id: true,
    },
  });

  if (duplicateClass) {
    throw new Error(
      "Another class already exists with the same class, section, and session"
    );
  }

  if (
    updateData.session &&
    updateData.session !== existingClass.session &&
    (existingClass._count.students > 0 ||
      existingClass._count.feeStructures > 0)
  ) {
    throw new Error(
      "Session cannot be changed once students or fee structures exist for this class"
    );
  }

  if(updateData.teacherId){
    const teacher = await client.teacher.findFirst({
      where:{id: updateData.teacherId}
    });

    if(!teacher){
      throw new Error("Invalid teacher")
    }
  }

  const updatedClass = await client.class.update({
    where: {id: classId},
    data: updateData,
  });

  return {
    success: true,
    message: "Class updated successfully",
    updatedClass
  }
}

export const deleteClass = async (classId, adminId) => {
  const existingClass = await client.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      adminId: true,
    },
  });

  if (!existingClass) {
    throw new Error("Class not found");
  }

  if (existingClass.adminId !== adminId) {
    throw new Error("Unauthorized");
  }


  await client.$transaction([
    client.student.deleteMany({
      where: { classId },
    }),

    client.class.delete({
      where: { id: classId },
    }),
  ]);

  return {
    message: "Class and its students deleted successfully",
  };
};

export const getAllClasses = async (query, adminId) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const session = query.session
    ? normalizeAcademicSession(query.session)
    : undefined;

  const skip = (page - 1) * limit;
  const whereCondition = {
    adminId,
    ...(session && { session }),
  };

  const [classes, total] = await Promise.all([
    client.class.findMany({
      where: whereCondition,
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        section: true,
        session: true,
        teacher: {
          select: {
            id: true,
            teacherName: true,
          },
        },
        _count: {
          select: { students: true }, //  count students instead of full data
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    client.class.count({
      where: whereCondition,
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    classes,
  };
};

export const getClassDropdown = async (adminId) => {
  const classes = await client.class.findMany({
    where: {
      adminId,
    },
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
    },
    orderBy: [
      {
        session: "desc",
      },
      {
        slug: "asc",
      },
      {
        section: "asc",
      },
    ],
  });

  return {
    message: "Class dropdown fetched successfully",
    classes,
  };
};

export const getClassById = async (classId, adminId) => {
  //  Check if class exists and belongs to admin
  const existingClass = await client.class.findFirst({
    where: {
      id: classId,
      adminId,
    },
  });

  if (!existingClass) {
    throw new Error("Class not found or unauthorized");
  }

  //  Fetch full detail
  const classDetail = await client.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
      teacher: {
        select: {
          id: true,
          teacherName: true,
          email: true,
          imageUrl: true,
        },
      },
      subjects: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
          subjects: true
        },
      },
      students: {
        select: {
          id: true,
          studentName: true,
          rollNumber: true,
          imageUrl: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    message: "Class detail fetched successfully",
    classDetail,
  };
};
