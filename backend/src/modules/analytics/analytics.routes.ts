import express from "express";
import * as dashboardController from "./analytics.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  dailyAttendanceQuerySchema,
  examIdParamsSchema,
  studentExamParamsSchema,
  studentIdParamsSchema,
} from "./analytics.schema.ts";

const router = express.Router();

router.get(
  "/",
  verifyUser(["admin"]),
  dashboardController.getAdminDashboard
);

router.get(
  "/daily-attendance",
  verifyUser(["admin"]),
  validateRequest(dailyAttendanceQuerySchema),
  dashboardController.getDailyAttendanceStats
);

/**
 * Student Performance Trend
 * Admin / Teacher / Student
 */

router.get(
  "/student-performance/:studentId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(studentIdParamsSchema),
  dashboardController.getStudentPerformanceTrend
);

// GET /api/analytics/exam/:examId
router.get(
  "/exam/:examId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(examIdParamsSchema),
  dashboardController.getExamAnalyticsController
);


/**
 * GET STUDENT EXAM LIST
*/

/**
 * SUBJECT PERFORMANCE (EXAM)
 */

router.get(
  "/student/:studentId/exam/:examId",
  verifyUser(["admin", "teacher","student"]),
  validateRequest(studentExamParamsSchema),
  dashboardController.getStudentExamSubjects
);

router.get(
  "/student/:studentId/exam-performance",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(studentIdParamsSchema),
  dashboardController.getStudentExamPerformance
);




export default router;
