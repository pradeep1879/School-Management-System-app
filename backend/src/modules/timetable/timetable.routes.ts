import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import * as timetableController from "./timetable.controller.ts";
import {
  createTimetableSchema,
  timetableClassParamsSchema,
  timetableIdParamsSchema,
  updateTimetableSchema,
} from "./timetable.schema.ts";

const router = express.Router();

router.post(
  "/",
  verifyUser(["admin"]),
  validateRequest(createTimetableSchema),
  timetableController.createTimetableSlot,
);

router.put(
  "/:id",
  verifyUser(["admin"]),
  validateRequest({
    ...timetableIdParamsSchema,
    ...updateTimetableSchema,
  }),
  timetableController.updateTimetableSlot,
);

router.delete(
  "/:id",
  verifyUser(["admin"]),
  validateRequest(timetableIdParamsSchema),
  timetableController.deleteTimetableSlot,
);

router.get(
  "/class/:classId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(timetableClassParamsSchema),
  timetableController.getTimetableByClass,
);

router.get(
  "/my",
  verifyUser(["teacher", "student"]),
  timetableController.getMyTimetable,
);

export default router;
