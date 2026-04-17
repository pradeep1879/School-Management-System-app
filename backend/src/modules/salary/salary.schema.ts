import { z } from "zod";
import {
  paramsWithId,
  positiveIntegerLike,
  positiveNumberLike,
} from "../shared/shared.schema.ts";

export const generatePayrollSchema = {
  body: z
    .object({
      month: positiveIntegerLike,
      year: positiveIntegerLike,
    })
    .passthrough(),
};

export const paySalarySchema = {
  params: paramsWithId("salaryId"),
  body: z
    .object({
      amount: positiveNumberLike,
      method: z.string().trim().min(1),
      referenceNo: z.string().optional(),
    })
    .passthrough(),
};
