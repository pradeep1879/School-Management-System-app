import { z } from "zod";
import {
  dateRangeQuerySchema,
  dateString,
  idParam,
  paramsWithId,
} from "../shared/shared.schema.ts";

const eventTypeSchema = z.enum(["HOLIDAY", "EXAM", "EVENT", "NOTICE"]);

export const createCalendarEventSchema = {
  body: z
    .object({
      title: z.string().trim().min(1).max(120),
      description: z.string().trim().max(1000).optional().nullable(),
      startDate: dateString,
      endDate: dateString,
      type: eventTypeSchema,
      classId: idParam.optional().nullable(),
    })
    .superRefine((value, ctx) => {
      if (
        new Date(value.startDate).getTime() >
        new Date(value.endDate).getTime()
      ) {
        ctx.addIssue({
          code: "custom",
          message: "End date must be after start date",
          path: ["endDate"],
        });
      }
    }),
};

export const updateCalendarEventSchema = createCalendarEventSchema;

export const calendarEventIdParamsSchema = {
  params: paramsWithId(),
};

export const calendarClassParamsSchema = {
  params: z.object({
    classId: idParam,
  }),
};

export const listCalendarEventsSchema = {
  query: dateRangeQuerySchema.extend({
    classId: idParam.optional(),
    type: eventTypeSchema.optional(),
  }),
};
