import express from "express";
import * as subjectController from "./subject.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  assignTeacherSchema,
  createSubjectSchema,
  subjectIdSchema,
  subjectListQuerySchema,
} from "./subject.schema.ts";

const router = express.Router();

// Admin only
router.post("/", verifyUser(["admin"]), validateRequest(createSubjectSchema), subjectController.createSubject);
router.patch("/:id/assign", verifyUser(["admin"]), validateRequest(assignTeacherSchema), subjectController.assignTeacher);
router.delete("/:id", verifyUser(["admin"]), validateRequest(subjectIdSchema), subjectController.deleteSubject);

// Admin & Teacher & Student
router.get("/", verifyUser(["admin", "teacher", "student"]), validateRequest(subjectListQuerySchema), subjectController.getAllSubjects);
router.get("/:id", verifyUser(["admin", "teacher", "student"]), validateRequest(subjectIdSchema), subjectController.getSubjectById);

export default router;
