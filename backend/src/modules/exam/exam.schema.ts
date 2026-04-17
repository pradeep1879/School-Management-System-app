import { z } from "zod";
import {
  dateString,
  nonNegativeNumberLike,
  paramsWithId,
} from "../shared/shared.schema.ts";

const examTypeEnum = z.enum(["UNIT", "MIDTERM", "FINAL", "PRACTICAL"]);
const examStatusEnum = z.enum([
  "SCHEDULED",
  "ONGOING",
  "EVALUATION",
  "PUBLISHED",
  "CANCELLED",
]);

const examSubjectSchema = z
  .object({
    subjectId: z.string().trim().min(1),
    totalMarks: nonNegativeNumberLike,
    passingMarks: nonNegativeNumberLike,
    syllabus: z.string().optional(),
  })
  .passthrough();

export const createExamSchema = {
  body: z
    .object({
      title: z.string().trim().min(1),
      examType: examTypeEnum,
      startDate: dateString,
      endDate: dateString.optional(),
      classId: z.string().trim().min(1),
      subjects: z.array(examSubjectSchema).min(1),
    })
    .passthrough(),
};

export const getExamsByClassSchema = {
  query: z
    .object({
      classId: z.string().trim().min(1),
    })
    .passthrough(),
};

export const updateExamStatusSchema = {
  params: paramsWithId("id"),
  body: z
    .object({
      status: examStatusEnum,
    })
    .passthrough(),
};

export const publishExamSchema = {
  params: paramsWithId("id"),
};

export const updateExamMarksSchema = {
  params: paramsWithId("id"),
  body: z
    .object({
      obtainedMarks: nonNegativeNumberLike,
    })
    .passthrough(),
};

export const bulkUpdateMarksSchema = {
  body: z
    .object({
      updates: z
        .array(
          z
            .object({
              resultId: z.string().trim().min(1),
              obtainedMarks: nonNegativeNumberLike,
            })
            .passthrough(),
        )
        .min(1),
    })
    .passthrough(),
};

export const studentExamSummarySchema = {
  query: z
    .object({
      examId: z.string().trim().min(1),
      studentId: z.string().trim().min(1),
    })
    .passthrough(),
};

export const examSubjectResultsSchema = {
  params: z
    .object({
      examId: z.string().trim().min(1),
      subjectId: z.string().trim().min(1),
    })
    .passthrough(),
};

export const examResultsOverviewSchema = {
  params: paramsWithId("examId"),
};

export const studentDetailedResultSchema = {
  params: z
    .object({
      examId: z.string().trim().min(1),
      studentId: z.string().trim().min(1),
    })
    .passthrough(),
};
