import { z } from "zod";
import {
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
      isOptional: z.boolean().optional(),
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
