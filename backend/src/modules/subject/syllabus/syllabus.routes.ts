import express from "express";
import * as syllabusController from "./syllabus.controller.ts";
import { verifyUser } from "../../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../../middlewares/validate.middleware.ts";
import {
  chapterIdParamsSchema,
  chapterSubjectParamsSchema,
  createChapterSchema,
  createChaptersBulkSchema,
  updateChapterStatusSchema,
} from "./syllabus.schema.ts";

const router = express.Router();

// Admin + Teacher

router.post(
  "/bulk",
  verifyUser(["admin", "teacher"]),
  validateRequest(createChaptersBulkSchema),
  syllabusController.createChaptersBulk
);

router.post(
  "/",
  verifyUser(["admin", "teacher"]),
  validateRequest(createChapterSchema),
  syllabusController.createChapter
);

router.patch(
  "/:chapterId/status",
  verifyUser(["admin", "teacher"]),
  validateRequest(updateChapterStatusSchema),
  syllabusController.updateChapterStatus
);

router.delete(
  "/:chapterId",
  verifyUser(["admin", "teacher"]),
  validateRequest(chapterIdParamsSchema),
  syllabusController.deleteChapter
);

// Everyone can view
router.get(
  "/subject/:subjectId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(chapterSubjectParamsSchema),
  syllabusController.getChaptersBySubject
);

export default router;
