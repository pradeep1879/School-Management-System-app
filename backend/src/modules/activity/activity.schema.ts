import { z } from "zod";

const requiredString = z.string().trim().min(1);

export const createActivitySchema = {
  body: z
    .object({
      title: requiredString,
      description: z.string().optional(),
      type: requiredString,
      startDate: z.string().trim().min(1),
      endDate: z.string().optional(),
      classId: requiredString,
    })
    .passthrough(),
};

export const getActivityByIdSchema = {
  params: z
    .object({
      id: requiredString,
    })
    .passthrough(),
};

export const getActivitiesByClassSchema = {
  query: z
    .object({
      classId: requiredString,
    })
    .passthrough(),
};

export const updateActivityStatusSchema = {
  params: z
    .object({
      id: requiredString,
    })
    .passthrough(),
  body: z
    .object({
      status: z.enum(["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"]),
    })
    .passthrough(),
};
