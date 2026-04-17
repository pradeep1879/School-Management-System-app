import { z } from "zod";
import {
  dateString,
  paginationQuerySchema,
  paramsWithId,
} from "../shared/shared.schema.ts";

export const createStudentSchema = {
  body: z
    .object({
      studentName: z.string().trim().min(1),
      userName: z.string().trim().min(1),
      rollNumber: z.string().trim().min(1),
      password: z.string().min(6),
      gender: z.string().trim().min(1),
      fatherName: z.string().trim().min(1),
      dateOfBirth: dateString,
      admissionDate: dateString,
      contactNo: z.string().trim().min(1),
      address: z.string().trim().min(1),
      classId: z.string().trim().min(1),
      teacherId: z.string().trim().min(1).optional(),
    })
    .passthrough(),
};

export const studentLoginSchema = {
  body: z
    .object({
      userName: z.string().trim().min(1),
      password: z.string().min(1),
    })
    .passthrough(),
};

export const studentListQuerySchema = {
  query: paginationQuerySchema.extend({
    classId: z.string().optional(),
  }),
};

export const studentsByClassSchema = {
  params: paramsWithId("classId"),
  query: paginationQuerySchema,
};

export const studentByIdSchema = {
  params: paramsWithId("studentId"),
};

export const updateStudentProfileSchema = {
  body: z
    .object({
      userName: z.string().trim().min(1).optional(),
      password: z.string().min(6).optional(),
      confirmPassword: z.string().min(6).optional(),
    })
    .refine(
      (body) =>
        body.userName !== undefined ||
        body.password !== undefined ||
        body.confirmPassword !== undefined,
      "At least one field is required",
    )
    .passthrough(),
};
