import express from "express";
import * as homeworkController from "./homework.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  createHomeworkSchema,
  deleteHomeworkSchema,
  homeworkByClassSchema,
  updateHomeworkStatusSchema,
} from "./homework.schema.ts";

const router = express.Router();

// Teacher creates homework
router.post(
  "/",
  verifyUser(["teacher"]),
  validateRequest(createHomeworkSchema),
  homeworkController.createHomework
);

// Get homework by class (teacher & student)
router.get(
  "/class/:classId",
  verifyUser(["teacher", "student", "admin"]),
  validateRequest(homeworkByClassSchema),
  homeworkController.getHomeworkByClass
);

// Update status (teacher only)
router.patch(
  "/:homeworkId/status",
  verifyUser(["teacher"]),
  validateRequest(updateHomeworkStatusSchema),
  homeworkController.updateHomeworkStatus
);

// Delete homework (teacher only)
router.delete(
  "/:homeworkId",
  verifyUser(["teacher"]),
  validateRequest(deleteHomeworkSchema),
  homeworkController.deleteHomework
);

export default router;
