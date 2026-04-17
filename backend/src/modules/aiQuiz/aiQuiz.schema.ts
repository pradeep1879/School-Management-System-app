import { z } from "zod";
import { paginationQuerySchema, paramsWithId, positiveIntegerLike } from "../shared/shared.schema.ts";

export const aiQuizDifficultySchema = z.enum(["easy", "medium", "hard"]);

export const generateAIQuizSchema = {
  body: z.object({
    subject: z.string().trim().min(1, "Subject is required"),
    difficulty: aiQuizDifficultySchema,
    numberOfQuestions: positiveIntegerLike.refine(
      (value) => Number(value) <= 20,
      "Maximum 20 questions allowed",
    ),
    topic: z.string().trim().max(120).optional().or(z.literal("")),
  }),
};

export const aiQuizParamsSchema = {
  params: paramsWithId("quizId"),
};

export const submitAIQuizSchema = {
  params: paramsWithId("quizId"),
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: z.string().trim().min(1),
          selectedAnswer: z.string().trim().min(1),
        }),
      )
      .min(1, "At least one answer is required"),
  }),
};

export const aiQuizHistoryQuerySchema = {
  query: paginationQuerySchema,
};
