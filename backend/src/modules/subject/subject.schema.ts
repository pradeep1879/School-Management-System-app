import { z } from "zod";
import {
  nonEmptyString,
  numberLike,
  paramsWithId,
} from "../shared/shared.schema.ts";

export const createSubjectSchema = {
  body: z
    .object({
      name: nonEmptyString,
      code: z.string().optional(),
      periods: numberLike.optional(),
      room: numberLike.optional(),
      classId: nonEmptyString,
      teacherId: z.string().trim().min(1).optional(),
    })
    .passthrough(),
};

export const subjectListQuerySchema = {
  query: z
    .object({
      classId: z.string().optional(),
    })
    .passthrough(),
};

export const subjectIdSchema = {
  params: paramsWithId("id"),
};

export const assignTeacherSchema = {
  params: paramsWithId("id"),
  body: z
    .object({
      teacherId: nonEmptyString,
    })
    .passthrough(),
};
