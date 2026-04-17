import express from "express";
import * as studentController from "./student.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  createStudentSchema,
  studentByIdSchema,
  studentListQuerySchema,
  studentLoginSchema,
  studentsByClassSchema,
  updateStudentProfileSchema,
} from "./student.schema.ts";

const router = express.Router();

router.post("/", verifyUser(["admin"]), validateRequest(createStudentSchema), studentController.createStudent);

router.post("/login", validateRequest(studentLoginSchema), studentController.loginStudent);
router.post("/logout", verifyUser(["student"]), studentController.logout);

router.get("/", verifyUser(["admin"]), validateRequest(studentListQuerySchema), studentController.getAllStudents);

router.get(
  "/class/:classId",
  verifyUser(["admin", "teacher"]),
  validateRequest(studentsByClassSchema),
  studentController.getStudentsByClass
);

router.get(
  "/profile",
  verifyUser(["student"]),
  studentController.getMyProfile
);

//  ADD THIS
router.get(
  "/my-class",
  verifyUser(["student"]),
  studentController.getMyClass
);

router.get(
  "/:studentId",
  verifyUser(["admin", "teacher"]),
  validateRequest(studentByIdSchema),
  studentController.getStudentById
);

router.patch(
  "/profile",
  verifyUser(["student"]),
  validateRequest(updateStudentProfileSchema),
  studentController.updateMyProfile
);




export default router;
