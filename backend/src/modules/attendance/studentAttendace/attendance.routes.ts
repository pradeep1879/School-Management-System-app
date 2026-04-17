import express from "express";
import * as attendanceController from "../studentAttendace/attendance.controller.ts";
import { verifyUser } from "../../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../../middlewares/validate.middleware.ts";
import {
  attendanceByClassSchema,
  classAttendanceSummarySchema,
  markAttendanceSchema,
  myAttendanceHistorySchema,
  studentAttendanceParamsSchema,
  updateAttendanceSessionSchema,
} from "./attendance.schema.ts";

const router = express.Router();

/**
 * Teacher → Mark Bulk Attendance
 */
router.post(
  "/bulk",
  verifyUser(["teacher"]),
  validateRequest(markAttendanceSchema),
  attendanceController.markAttendance
);

/**
 * Get Attendance by class & date
 */
router.get(
  "/class/:classId",
  verifyUser(["admin", "teacher"]),
  validateRequest(attendanceByClassSchema),
  attendanceController.getAttendanceByDate
);

router.get(
  "/student/me",
  verifyUser(["student"]),
  validateRequest(myAttendanceHistorySchema),
  attendanceController.getStudentAttendanceHistory
);

router.get(
  "/student/:studentId",
  verifyUser(["admin", "teacher"]),
  validateRequest(studentAttendanceParamsSchema),
  attendanceController.getStudentAttendanceById
);

router.get(
  "/class/:classId/summary",
  verifyUser(["admin", "teacher"]),
  validateRequest(classAttendanceSummarySchema),
  attendanceController.getClassAttendanceSummary
);

/**
 * Update single student attendance
 */
router.put(
  "/session/:sessionId",
  verifyUser(["teacher"]),
  validateRequest(updateAttendanceSessionSchema),
  attendanceController.updateAttendanceSession
);
export default router;
