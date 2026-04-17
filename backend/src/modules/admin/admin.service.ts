// @ts-nocheck
import { client } from "../../prisma/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import config from "../../config/env.js";
import  { imagekit }  from "../../config/imagekit.ts";
import config from "../../../config.ts";



export const signup = async ({ name, email, password }) => {
  const existingAdmin = await client.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await client.admin.create({
    data: { name, email, password: hashedPassword },
  });

  const { password: _, ...safeAdmin } = admin;

  return {
    message: "Admin created successfully",
    sucess: true,
    admin: safeAdmin,
  };
};


export const login = async ({ email, password }) => {
  const admin = await client.admin.findUnique({
    where: { email },
  });

  if (!admin) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: admin.id, role: "admin" }, config.JWT_SECRET,{ expiresIn: "1d" });

  const { password: _, ...safeAdmin } = admin;

  return {
    message: "Admin logged in successfully",
    sucess:true,
    token,
    admin: safeAdmin,
  };
};

export const logout = async (adminId) => {
  return {
    success: true,
    message: "Admin logged out successfully",
  };
};

export const getProfile = async (adminId) => {
  const admin = await client.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  return {
    message: "Profile fetched successfully",
    admin,
  };
};



export const getDashboardData = async (adminId) => {
  console.log("hi there from get dashboard data");
  const [
    totalClasses,
    totalTeachers,
    totalStudents,
    monthlyRevenue,
  ] = await Promise.all([
    client.class.count({ where: { adminId } }),
    client.teacher.count({ where: { adminId } }),
    client.student.count(),
    // client.fee.groupBy({
    //   by: ["month"],
    //   _sum: { amount: true },
    // }),
  ]);

  return {
    stats: {
      totalClasses,
      totalTeachers,
      totalStudents,
    },
    graphs: {
      monthlyRevenue,
    },
  };
};


export const updateMyProfile = async (adminId, body) =>{
  const { email, oldPassword, password, confirmPassword } = body;
  
  const admin = await client.admin.findUnique({
      where: { id: adminId },
    });
  
    if (!admin) {
      throw new Error("User not found");
    }
  
    const updateData = {};
  
    // Update email
    if (email) {
      const existing = await client.admin.findUnique({
        where: { email },
      });
  
      if (existing && existing.id !== adminId) {
        throw new Error("Username already taken");
      }
  
      updateData.email = email;
    }
  
    // Update password
    if (oldPassword ||password || confirmPassword) {
      if (!password || !confirmPassword || !oldPassword) {
        throw new Error("Password and confirm password required");
      }
      
      if( oldPassword !== admin.password){
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
  
    const updatedAdmin = await client.admin.update({
      where: { id: teacherId },
      data: updateData,
    });
    const { password: _, ...safeAdmin } = updatedAdmin;
    
    
    return {
      message: "Profile updated successfully",
      admin: safeAdmin,
    };
}





