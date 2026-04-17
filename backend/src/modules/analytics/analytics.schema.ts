import { z } from "zod";
import {
  paramsWithId,
  positiveIntegerLike,
} from "../shared/shared.schema.ts";

export const dailyAttendanceQuerySchema = {
  query: z
    .object({
      days: positiveIntegerLike.optional(),
    })
    .passthrough(),
};

export const studentIdParamsSchema = {
  params: paramsWithId("studentId"),
};

export const examIdParamsSchema = {
  params: paramsWithId("examId"),
};

export const studentExamParamsSchema = {
  params: z
    .object({
      studentId: z.string().trim().min(1),
      examId: z.string().trim().min(1),
    })
    .passthrough(),
};
