import express from "express";
import * as examController from "./exam.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  bulkUpdateMarksSchema,
  createExamSchema,
  examResultsOverviewSchema,
  examSubjectResultsSchema,
  getExamsByClassSchema,
  publishExamSchema,
  studentDetailedResultSchema,
  studentExamSummarySchema,
  updateExamMarksSchema,
  updateExamStatusSchema,
} from "./exam.schema.ts";

const router = express.Router();

/* Create */

// Admin + Teacher
router.post(
  "/",
  verifyUser(["admin", "teacher"]),
  validateRequest(createExamSchema),
  examController.createExam
);

/*  Fetch  */

// Get exams by class
router.get(
  "/",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(getExamsByClassSchema),
  examController.getExamsByClass
);

// Student exam summary
router.get(
  "/summary",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(studentExamSummarySchema),
  examController.getStudentExamSummary
);

// Get exam results overview (teacher/admin)
router.get(
  "/:examId/results",
  verifyUser(["admin", "teacher"]),
  validateRequest(examResultsOverviewSchema),
  examController.getExamResultsOverview
);

// Get detailed student result
router.get(
  "/:examId/result/:studentId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(studentDetailedResultSchema),
  examController.getStudentDetailedResult
);

/* ================= MARKS ================= */

// Get subject results (for marks entry)
router.get(
  "/:examId/subject/:subjectId/results",
  verifyUser(["admin", "teacher"]),
  validateRequest(examSubjectResultsSchema),
  examController.getSubjectResults
);

// Bulk update marks
router.patch(
  "/bulk-marks",
  verifyUser(["admin", "teacher"]),
  validateRequest(bulkUpdateMarksSchema),
  examController.bulkUpdateMarks
);

// Update single result marks
router.patch(
  "/result/:id",
  verifyUser(["admin", "teacher"]),
  validateRequest(updateExamMarksSchema),
  examController.updateExamMarks
);

/* ================= STATUS ================= */

// Publish exam
router.patch(
  "/:id/publish",
  verifyUser(["admin", "teacher"]),
  validateRequest(publishExamSchema),
  examController.publishExam
);

// Update exam status
router.patch(
  "/:id/status",
  verifyUser(["admin", "teacher"]),
  validateRequest(updateExamStatusSchema),
  examController.updateExamStatus
);

export default router;
