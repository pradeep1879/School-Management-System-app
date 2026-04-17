import { z } from "zod";
import {
  integerLike,
  paramsWithId,
} from "../../shared/shared.schema.ts";

export const createChapterSchema = {
  body: z
    .object({
      subjectId: z.string().trim().min(1),
      title: z.string().trim().min(1),
      description: z.string().optional(),
      order: integerLike.optional(),
    })
    .passthrough(),
};

export const createChaptersBulkSchema = {
  body: z
    .object({
      subjectId: z.string().trim().min(1),
      chapters: z
        .array(
          z
            .object({
              title: z.string().trim().min(1),
              description: z.string().optional(),
            })
            .passthrough(),
        )
        .min(1),
    })
    .passthrough(),
};

export const chapterSubjectParamsSchema = {
  params: paramsWithId("subjectId"),
};

export const chapterIdParamsSchema = {
  params: paramsWithId("chapterId"),
};

export const updateChapterStatusSchema = {
  params: paramsWithId("chapterId"),
  body: z
    .object({
      status: z.enum(["PENDING", "ONGOING", "COMPLETED"]),
    })
    .passthrough(),
};
