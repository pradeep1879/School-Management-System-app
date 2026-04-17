import { z } from "zod";
import { dateString, paramsWithId } from "../shared/shared.schema.ts";

export const createHomeworkSchema = {
  body: z
    .object({
      title: z.string().trim().min(1),
      dueDate: dateString,
      classId: z.string().trim().min(1),
      subjects: z
        .array(
          z
            .object({
              subjectId: z.string().trim().min(1),
              description: z.string().optional(),
            })
            .passthrough(),
        )
        .min(1),
    })
    .passthrough(),
};

export const homeworkByClassSchema = {
  params: paramsWithId("classId"),
};

export const updateHomeworkStatusSchema = {
  params: paramsWithId("homeworkId"),
  body: z
    .object({
      status: z.enum(["ASSIGNED", "COMPLETED", "CANCELLED"]),
    })
    .passthrough(),
};

export const deleteHomeworkSchema = {
  params: paramsWithId("homeworkId"),
};
