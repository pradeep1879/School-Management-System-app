import { z } from "zod";
import {
  integerLike,
  nonNegativeNumberLike,
  paramsWithId,
  positiveNumberLike,
} from "../shared/shared.schema.ts";

export const createFeeStructureSchema = {
  body: z
    .object({
      classId: z.string().trim().min(1),
      session: z.string().trim().min(1),
      lateFeeType: z.enum(["NONE", "FIXED", "DAILY"]),
      lateFeeAmount: nonNegativeNumberLike,
    })
    .passthrough(),
};

export const addFeeComponentSchema = {
  body: z
    .object({
      feeStructureId: z.string().trim().min(1),
      name: z.string().trim().min(1),
      amount: positiveNumberLike,
      frequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "ONE_TIME"]),
      dueDay: integerLike.refine((value) => {
        const day = Number(value);
        return day >= 1 && day <= 31;
      }, "Due day must be between 1 and 31"),
      dueMonth: integerLike
        .refine((value) => {
          const month = Number(value);
          return month >= 1 && month <= 12;
        }, "Due month must be between 1 and 12")
        .optional(),
      isOptional: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.frequency !== "MONTHLY" &&
        (data.dueMonth === undefined ||
          data.dueMonth === null)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dueMonth"],
          message:
            "Due month is required for quarterly, yearly, and one-time fees",
        });
      }
    })
    .passthrough(),
};

export const structureIdParamsSchema = {
  params: paramsWithId("structureId"),
};

export const collectPaymentSchema = {
  body: z
    .object({
      installmentId: z.string().trim().min(1),
      amountPaid: positiveNumberLike,
      paymentMethod: z.enum(["CASH", "UPI", "CARD", "BANK_TRANSFER"]).optional(),
    })
    .passthrough(),
};

export const studentFeeSummarySchema = {
  params: paramsWithId("studentId"),
};

export const classFeeSummarySchema = {
  params: paramsWithId("classId"),
};
