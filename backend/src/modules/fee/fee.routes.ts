import express from "express";
import * as feeController from "./fee.controller.ts";
import * as feeAnalytics from "./fee.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  addFeeComponentSchema,
  classFeeSummarySchema,
  collectPaymentSchema,
  createFeeStructureSchema,
  structureIdParamsSchema,
  studentFeeSummarySchema,
} from "./fee.schema.ts";

const router = express.Router();

// this is only for admin
router.post(
  "/structure",
  verifyUser(["admin"]),
  validateRequest(createFeeStructureSchema),
  feeController.createFeeStructure
);

router.post(
  "/component",
  verifyUser(["admin"]),
  validateRequest(addFeeComponentSchema),
  feeController.addFeeComponent
);

router.post(
  "/generate-installments/:structureId",
  verifyUser(["admin"]),
  validateRequest(structureIdParamsSchema),
  feeController.generateInstallmentsForStructure
);

router.post(
  "/collect",
  verifyUser(["admin"]),
  validateRequest(collectPaymentSchema),
  feeController.collectPayment
);

router.get(
  "/admin/summary",
  verifyUser(["admin"]),
  feeController.getAdminFinanceSummary
);

// dashboar analytics route

router.get(
  "/dashboard",
  verifyUser(["admin"]),
  feeAnalytics.getFinanceDashboard
);

router.get(
  "/student/:studentId",
  verifyUser(["admin"]),
  validateRequest(studentFeeSummarySchema),
  feeController.getStudentFeeSummary
);

router.get(
  "/class/:classId/summary",
  verifyUser(["admin"]),
  validateRequest(classFeeSummarySchema),
  feeController.getClassFeeSummary
);


// this route is for student.         

router.get(
  "/my",
  verifyUser(["student"]),
  feeController.getMyFeeSummary
);

export default router;
