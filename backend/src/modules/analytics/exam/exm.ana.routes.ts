import express from "express";
import { verifyUser } from "../../../middlewares/auth.middleware.ts"
import * as examAnalyticsController from './exm.ana.controller.ts'
import { validateRequest } from "../../../middlewares/validate.middleware.ts";
import { examAnalyticsParamsSchema } from "./exm.ana.schema.ts";
const router = express.Router();




router.get(
  "/exam/:examId",
  verifyUser(["admin", "teacher"]),
  validateRequest(examAnalyticsParamsSchema),
  examAnalyticsController.getExamAnalytics
);




export default router;
