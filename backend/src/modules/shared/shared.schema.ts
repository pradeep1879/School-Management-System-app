import { z } from "zod";

export const nonEmptyString = z.string().trim().min(1);

export const idParam = nonEmptyString;

export const dateString = nonEmptyString.refine(
  (value) => !Number.isNaN(new Date(value).getTime()),
  "Invalid date",
);

export const numberLike = z
  .union([z.number(), nonEmptyString])
  .refine((value) => Number.isFinite(Number(value)), "Invalid number");

export const positiveNumberLike = numberLike.refine(
  (value) => Number(value) > 0,
  "Must be greater than 0",
);

export const nonNegativeNumberLike = numberLike.refine(
  (value) => Number(value) >= 0,
  "Must be 0 or greater",
);

export const integerLike = z
  .union([z.number().int(), nonEmptyString])
  .refine(
    (value) => Number.isInteger(Number(value)),
    "Must be an integer",
  );

export const positiveIntegerLike = integerLike.refine(
  (value) => Number(value) > 0,
  "Must be greater than 0",
);

export const paginationQuerySchema = z
  .object({
    page: positiveIntegerLike.optional(),
    limit: positiveIntegerLike.optional(),
    search: z.string().optional(),
  })
  .passthrough();

export const dateRangeQuerySchema = z
  .object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  })
  .passthrough();

export const paramsWithId = (key = "id") =>
  z.object({ [key]: idParam }).passthrough();
