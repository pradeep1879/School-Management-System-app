import { z } from "zod";
import {
  paginationQuerySchema,
  paramsWithId,
  positiveNumberLike,
} from "../shared/shared.schema.ts";

export const createTeacherSchema = {
  body: z
    .object({
      teacherName: z.string().trim().min(1),
      email: z.email(),
      contactNo: z.string().trim().min(1),
      experience: z.string().trim().min(1),
      baseSalary: positiveNumberLike,
      perDaySalary: positiveNumberLike,
      password: z.string().min(6),
    })
    .passthrough(),
};

export const teacherLoginSchema = {
  body: z
    .object({
      email: z.email(),
      password: z.string().min(1),
    })
    .passthrough(),
};

export const teacherListQuerySchema = {
  query: paginationQuerySchema,
};

export const teacherIdParamsSchema = {
  params: paramsWithId("id"),
};

export const updateTeacherProfileSchema = {
  body: z
    .object({
      email: z.email().optional(),
      oldPassword: z.string().min(6).optional(),
      password: z.string().min(6).optional(),
      confirmPassword: z.string().min(6).optional(),
    })
    .refine(
      (body) =>
        body.email !== undefined ||
        body.oldPassword !== undefined ||
        body.password !== undefined ||
        body.confirmPassword !== undefined,
      "At least one field is required",
    )
    .passthrough(),
};
