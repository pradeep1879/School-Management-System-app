import express from "express";
import * as teacherSalaryController from "./salary.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import { generatePayrollSchema, paySalarySchema } from "./salary.schema.ts";

const router = express.Router();

/**
 * Admin → Generate Monthly Payroll
 */
router.post(
  "/generate",
  verifyUser(["admin"]),
  validateRequest(generatePayrollSchema),
  teacherSalaryController.generatePayroll
);

/**
 * Admin → Get All Salary Records
 */
router.get(
  "/",
  verifyUser(["admin"]),
  teacherSalaryController.getAllSalaries
);

/**
 * Admin → Pay Salary
 */
router.patch(
  "/:salaryId/pay",
  verifyUser(["admin"]),
  validateRequest(paySalarySchema),
  teacherSalaryController.paySalary
);

/**
 * Teacher → Get My Salary History
 */
router.get(
  "/me",
  verifyUser(["teacher"]),
  teacherSalaryController.getMySalary
);

export default router;
