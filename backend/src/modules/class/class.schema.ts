import { z } from "zod";
import {
  nonEmptyString,
  paginationQuerySchema,
  paramsWithId,
} from "../shared/shared.schema.ts";

export const createClassSchema = {
  body: z
    .object({
      slug: nonEmptyString,
      section: nonEmptyString,
      session: nonEmptyString,
      teacherId: z.string().trim().min(1).optional(),
    })
    .passthrough(),
};

export const updateClassSchema = {
  params: paramsWithId("classId"),
  body: z
    .object({
      slug: nonEmptyString.optional(),
      section: nonEmptyString.optional(),
      session: nonEmptyString.optional(),
      teacherId: z.string().trim().min(1).nullable().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, "At least one field is required")
    .passthrough(),
};

export const classIdParamsSchema = {
  params: paramsWithId("classId"),
};

export const classByIdParamsSchema = {
  params: paramsWithId("id"),
};

export const classListQuerySchema = {
  query: paginationQuerySchema.extend({
    session: z.string().optional(),
  }),
};
