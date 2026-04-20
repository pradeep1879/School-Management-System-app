import { z } from "zod";
import {
  idParam,
  paramsWithId,
} from "../shared/shared.schema.ts";

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format");

export const createTimetableSchema = {
  body: z.object({
    classId: idParam,
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: timeString,
    endTime: timeString,
    subjectId: idParam,
    teacherId: idParam,
    room: z.string().trim().max(50).optional().nullable(),
  }),
};

export const updateTimetableSchema = createTimetableSchema;

export const timetableIdParamsSchema = {
  params: paramsWithId(),
};

export const timetableClassParamsSchema = {
  params: z.object({
    classId: idParam,
  }),
};
