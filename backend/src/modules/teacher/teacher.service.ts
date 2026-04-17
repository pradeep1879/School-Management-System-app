// @ts-nocheck
import { imagekit } from "../../config/imagekit.ts";
import { client } from "../../prisma/db.ts";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import fs from "fs";
import config from "../../../config.ts";

export const createTeacher = async (body, files, adminId) => {
  const {
    teacherName,
    email,
    contactNo,
    experience,
    baseSalary,
    perDaySalary,
    password,
  } = body;

  if (
    !teacherName ||
    !email ||
    !contactNo ||
    !password ||
    !experience ||
    !baseSalary ||
    !perDaySalary
  ) {
    throw new Error("All fields are required");
  }

  const existing = await client.teacher.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  if (!files?.image) {
    throw new Error("No image uploaded");
  }

  const imageFile = files.image;

  const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedFormat.includes(imageFile.mimetype)) {
    throw new Error("Invalid file format");
  }

  const uploadResponse = await imagekit.upload({
    file: fs.readFileSync(imageFile.tempFilePath),
    fileName: `${Date.now()}_${imageFile.name}`,
    folder: "/teachers",
  });

  if (!uploadResponse?.url) {
    throw new Error("Image upload failed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  /**
   * Create teacher + salary structure in transaction
   */
  const teacher = await client.$transaction(async (tx) => {
    const newTeacher = await tx.teacher.create({
      data: {
        teacherName,
        email,
        password: hashedPassword,
        contactNo,
        experience,
        imageFileId: uploadResponse.fileId,
        imageUrl: uploadResponse.url,
        adminId,
      },
    });

    await tx.salaryStructure.create({
      data: {
        teacherId: newTeacher.id,
        baseSalary: parseFloat(baseSalary),
        perDaySalary: parseFloat(perDaySalary),
        effectiveFrom: new Date(),
      },
    });

    return newTeacher;
  });

  fs.unlinkSync(imageFile.tempFilePath);

  const { password: _, ...safeTeacher } = teacher;

  return {
    message: "Teacher created successfully",
    teacher: safeTeacher,
  };
};

export const teacherLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }
  const teacher = await client.teacher.findUnique({
    where: { email },
  });

  if (!teacher) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, teacher.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: teacher.id, role: "teacher" },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...safeTeacher } = teacher;

  return {
    message: "Login successful",
    token,
    teacher: safeTeacher,
  };
};


export const logout = async (adminId) => {
  return {
    success: true,
    message: "Teacher logged out successfully",
  };
};


export const getAllTeachers = async (query) => {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  const skip = (page - 1) * limit;

  const [teachers, total] = await Promise.all([
    client.teacher.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        teacherName: true,
        email: true,
        salaryStructures:true,
        contactNo: true,
        experience: true,
        imageUrl: true,
        createdAt: true,
      },
       orderBy: {
        createdAt: "desc",
      },
    }),

    client.teacher.count(),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    teachers,
  };
};


export const getTeacherById = async (teacherId) => {
  if (!teacherId) {
    throw new Error("Teacher ID is required");
  }

  const teacher = await client.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      teacherName: true,
      email: true,
      contactNo: true,
      imageUrl: true,
      createdAt: true,
      admin: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return {
    message: "Teacher fetched successfully",
    teacher,
  };
};

export const getTeacherClass = async (teacherId) => {
  if (!teacherId) {
    throw new Error("Unauthorized");
  }

  const teacherClass = await client.class.findFirst({
    where: {
      teacherId,
    },
    select: {
      id: true,
      slug: true,
      section: true,
      session: true,
      students: {
      select: {
        id: true,
        studentName: true,
        rollNumber: true,
        imageUrl: true,
      },
    },
      subjects: true,
      _count: {
        select: {
          students: true,
          subjects: true,
        },
      },
      teacher: {
        select: {
          teacherName: true,
        },
      },
    },
  });

  if (!teacherClass) {
    throw new Error("No class assigned to this teacher");
  }

  return {
    message: "Class fetched successfully",
    classDetail: teacherClass,
  };
};


export const getTeacherProfile = async (teacherId) => {
  if (!teacherId) {
    throw new Error("Unauthorized");
  }

  const teacher = await client.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      teacherName: true,
      email: true,
      contactNo: true,
      experience: true,
      imageUrl: true,
      createdAt: true,

      //  Include subjects
      subjects: {
        select: {
          id: true,
          name: true,
        },
      },

      //  Include classes
      classes: {
        select: {
          id: true,
          slug: true,
          section: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return {
    message: "Profile fetched successfully",
    teacher,
  };
};


export const updateMyProfile = async (teacherId, body) =>{
  const { email, oldPassword, password, confirmPassword } = body;

  const teacher = await client.teacher.findUnique({
      where: { id: teacherId },
    });
  
    if (!teacher) {
      throw new Error("User not found");
    }
  
    const updateData = {};
  
    // Update username
    if (email) {
      const existing = await client.teacher.findUnique({
        where: { email },
      });
  
      if (existing && existing.id !== teacherId) {
        throw new Error("Username already taken");
      }
  
      updateData.email = email;
    }
  
    // Update password
    if (oldPassword ||password || confirmPassword) {
      if (!password || !confirmPassword || !oldPassword) {
        throw new Error("Password and confirm password required");
      }
      
      if( oldPassword !== teacher.password){
        throw new Error("Old passwrod is incorrect")
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
  
    const updatedTeacher = await client.teacher.update({
      where: { id: teacherId },
      data: updateData,
    });
  
    const { password: _, ...safeTeacher } = updatedTeacher;
  
    return {
      message: "Profile updated successfully",
      student: safeTeacher,
    };
}
