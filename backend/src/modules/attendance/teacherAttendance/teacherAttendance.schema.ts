import { z } from "zod";
import { paramsWithId } from "../../shared/shared.schema.ts";

export const submitTeacherAttendanceSchema = {
  body: z
    .object({
      status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY", "HOLIDAY"]),
      note: z.string().optional(),
    })
    .passthrough(),
};

export const attendanceIdParamsSchema = {
  params: paramsWithId("attendanceId"),
};

export const rejectAttendanceSchema = {
  params: paramsWithId("attendanceId"),
  body: z
    .object({
      reason: z.string().trim().min(1),
    })
    .passthrough(),
};

export const teacherAttendanceHistoryParamsSchema = {
  params: paramsWithId("teacherId"),
};
