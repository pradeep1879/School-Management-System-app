import { z } from "zod";
import { paginationQuerySchema, paramsWithId } from "../shared/shared.schema.ts";

const targetTypeSchema = z.enum(["SCHOOL", "CLASS", "TEACHERS"]);

export const createAnnouncementSchema = {
  body: z.object({
    title: z.string().trim().min(1, "Title is required").max(120),
    message: z.string().trim().min(1, "Message is required").max(2000),
    targetType: targetTypeSchema,
    classId: z.string().trim().min(1).optional().nullable(),
  }),
};

export const listAnnouncementsSchema = {
  query: paginationQuerySchema.optional().default({}),
};

export const announcementIdParamsSchema = {
  params: paramsWithId(),
};
