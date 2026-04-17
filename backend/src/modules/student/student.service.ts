// @ts-nocheck
import { client } from "../../prisma/db.ts";
import { imagekit } from "../../config/imagekit.ts";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import fs from "fs";
import config from "../../../config.ts";

export const createStudent = async (body, files, adminId) => {
  const {
    studentName,
    userName,
    rollNumber,
    password,
    gender,
    fatherName,
    dateOfBirth,
    admissionDate,
    contactNo,
    address,
    classId,
    teacherId,
  } = body;

  if (
    !studentName ||
    !userName ||
    !rollNumber ||
    !gender ||
    !password ||
    !fatherName ||
    !dateOfBirth ||
    !admissionDate ||
    !contactNo ||
    !address ||
    !classId 
  ) {
    throw new Error("All required fields must be provided");
  }

  const existing = await client.student.findUnique({
    where: { userName },
  });

  if (existing) {
    throw new Error("Student username already exists");
  }

  // Validate class
  const classExists = await client.class.findFirst({
    where: { id: classId, adminId },
  });

  if (!classExists) {
    throw new Error("Invalid class");
  }

  let imageUrl = null;
  let imageFileId = null;

  // Upload image if provided
  if (files?.image) {
    const imageFile = files.image;

    const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormat.includes(imageFile.mimetype)) {
      throw new Error("Invalid image format");
    }

    const uploadResponse = await imagekit.upload({
      file: fs.readFileSync(imageFile.tempFilePath),
      fileName: `${Date.now()}_${imageFile.name}`,
      folder: "/students",
    });

    imageUrl = uploadResponse.url;
    imageFileId = uploadResponse.fileId;

    fs.unlinkSync(imageFile.tempFilePath);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await client.student.create({
    data: {
      studentName,
      userName,
      rollNumber,
      password: hashedPassword,
      gender,
      fatherName,
      admissionDate: new Date(admissionDate),
      dateOfBirth: new Date(dateOfBirth),
      contactNo,
      address,
      classId,
      teacherId: teacherId || null,
      imageUrl,
      imageFileId,
    },
  });

  return {
    message: "Student created successfully",
    student,
  };
};


export const loginStudent = async ({ userName, password }) => {
  if (!userName || !password) {
    throw new Error("Username and password required");
  }

  const student = await client.student.findUnique({
    where: { userName },
  });

  if (!student) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: student.id, role: "student" },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...safeStudent } = student;

  return {
    message: "Login successful",
    token,
    student: safeStudent,
  };
};

export const logout = async() => {
  return {
    success: true,
    message: "Teacher logged out successfully",
  };
}

export const getMyProfile = async (studentId) => {
  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      userName: true,
      imageUrl: true,
      rollNumber: true,
      gender: true,
      contactNo: true,
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
    throw new Error("Student not found");
  }

  return {
    success: true,
    student,
  };
};

export const getMyClass = async (studentId) => {
  if (!studentId) {
    throw new Error("Student ID required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
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
    throw new Error("Student not found");
  }

  return {
    classDetail: student.class,
  };
};

export const getStudentsByClass = async (classId, query, role, userId) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }

  const existingClass = await client.class.findUnique({
    where: { id: classId },
  });

  if (!existingClass) {
    throw new Error("Class not found");
  }

  //  Authorization
  if (role === "teacher" && existingClass.teacherId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (role === "admin" && existingClass.adminId !== userId) {
    throw new Error("Unauthorized access");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";

  const skip = (page - 1) * limit;

  const whereCondition = {
    classId,
    OR: [
      { studentName: { contains: search, mode: "insensitive" } },
      { userName: { contains: search, mode: "insensitive" } },
      { rollNumber: { contains: search, mode: "insensitive" } },
    ],
  };

  const [students, total] = await Promise.all([
    client.student.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
    client.student.count({ where: whereCondition }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    students,
  };
};

export const getStudentById = async (studentId, role, userId) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      userName: true,
      gender: true,
      imageUrl: true,
      rollNumber: true,
      fatherName: true,
      contactNo: true,
      admissionDate: true,
      dateOfBirth: true,
      address: true,

      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
          adminId: true,
          teacherId: true
        },
      },

      teacher: {
        select: {
          id: true,
          teacherName: true,
          email: true,
        },
      },

      attendance: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  //  Authorization
  if (role === "admin" && student.class.adminId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (role === "teacher" && student.class.teacherId !== userId) {
    throw new Error("Unauthorized access");
  }

  return {
    success: true,
    student,
  };
};

export const getAllStudents = async (query, adminId) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";
  const classId = query.classId || null;

  const skip = (page - 1) * limit;


  const whereCondition = {
    class:{
      classId
    },
    ...(classId && { classId }),
    ...(search && {
      OR: [
        { studentName: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
        { rollNumber: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [students, total] = await Promise.all([
    client.student.findMany({
      where: whereCondition,
      skip,
      take: limit,
      select: {
        id: true,
        studentName: true,
        userName: true,
        rollNumber: true,
        gender: true,
        contactNo: true,
        imageUrl: true,
        class: {
          select: {
            id: true,
            slug: true,
            section: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    client.student.count({
      where: whereCondition,
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    students,
  };
};


export const updateMyProfile = async (studentId, body) => {
  const { userName, password, confirmPassword } = body;

  const student = await client.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const updateData = {};

  // Update username
  if (userName) {
    const existing = await client.student.findUnique({
      where: { userName },
    });

    if (existing && existing.id !== studentId) {
      throw new Error("Username already taken");
    }

    updateData.userName = userName;
  }

  // Update password
  if (password || confirmPassword) {
    if (!password || !confirmPassword) {
      throw new Error("Password and confirm password required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    updateData.password = hashedPassword;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update");
  }

  const updatedStudent = await client.student.update({
    where: { id: studentId },
    data: updateData,
  });

  const { password: _, ...safeStudent } = updatedStudent;

  return {
    message: "Profile updated successfully",
    student: safeStudent,
  };
};
