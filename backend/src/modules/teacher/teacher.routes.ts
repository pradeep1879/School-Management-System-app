import express from "express";
import * as teacherController from "./teacher.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  createTeacherSchema,
  teacherIdParamsSchema,
  teacherListQuerySchema,
  teacherLoginSchema,
  updateTeacherProfileSchema,
} from "./teacher.schema.ts";

const router = express.Router();

/* Public */
router.post("/login", validateRequest(teacherLoginSchema), teacherController.loginTeacher);

/* Teacher Profile ,:id routes should put at end */
router.get("/profile", verifyUser(["teacher"]), teacherController.getProfile);
router.post("/logout", verifyUser(["teacher"]),  teacherController.logout);

/* Admin Routes */
router.post("/", verifyUser(["admin"]), validateRequest(createTeacherSchema), teacherController.createTeacher);
router.get("/", verifyUser(["admin","teacher"]), validateRequest(teacherListQuerySchema), teacherController.getAllTeachers);
router.get("/class",  verifyUser(["teacher"]), teacherController.getTeacherClass);
router.get("/:id", verifyUser(["admin"]), validateRequest(teacherIdParamsSchema), teacherController.getTeacherById);

router.patch("/profile", verifyUser(["teacher"]), validateRequest(updateTeacherProfileSchema), teacherController.updateMyProfile);

export default router;
