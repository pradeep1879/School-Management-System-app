import { z } from "zod";
import {
  dateRangeQuerySchema,
  dateString,
  paramsWithId,
} from "../../shared/shared.schema.ts";

const attendanceStatusEnum = z.enum([
  "ABSENT",
  "LATE",
  "LEAVE",
  "HOLIDAY",
]);

const attendanceExceptionSchema = z
  .object({
    studentId: z.string().trim().min(1),
    status: attendanceStatusEnum,
  })
  .passthrough();

export const markAttendanceSchema = {
  body: z
    .object({
      classId: z.string().trim().min(1),
      date: dateString,
      exceptions: z.array(attendanceExceptionSchema).optional(),
    })
    .passthrough(),
};

export const attendanceByClassSchema = {
  params: paramsWithId("classId"),
  query: z
    .object({
      date: dateString,
    })
    .passthrough(),
};

export const studentAttendanceParamsSchema = {
  params: paramsWithId("studentId"),
  query: dateRangeQuerySchema,
};

export const myAttendanceHistorySchema = {
  query: dateRangeQuerySchema,
};

export const classAttendanceSummarySchema = {
  params: paramsWithId("classId"),
};

export const updateAttendanceSessionSchema = {
  params: paramsWithId("sessionId"),
  body: z
    .object({
      exceptions: z.array(attendanceExceptionSchema),
    })
    .passthrough(),
};
