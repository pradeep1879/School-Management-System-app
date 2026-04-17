import { z } from "zod";
import { nonEmptyString } from "../shared/shared.schema.ts";

export const adminSignupSchema = {
  body: z
    .object({
      name: nonEmptyString,
      email: z.email(),
      password: z.string().min(6),
    })
    .passthrough(),
};

export const adminLoginSchema = {
  body: z
    .object({
      email: z.email(),
      password: nonEmptyString,
    })
    .passthrough(),
};

export const adminUpdateProfileSchema = {
  body: z
    .object({
      email: z.email().optional(),
      oldPassword: z.string().min(6).optional(),
      password: z.string().min(6).optional(),
      confirmPassword: z.string().min(6).optional(),
    })
    .refine(
      (body) =>
        body.email !== undefined ||
        body.oldPassword !== undefined ||
        body.password !== undefined ||
        body.confirmPassword !== undefined,
      "At least one field is required",
    )
    .passthrough(),
};
