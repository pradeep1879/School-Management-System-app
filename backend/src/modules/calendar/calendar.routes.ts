import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import * as calendarController from "./calendar.controller.ts";
import {
  calendarClassParamsSchema,
  calendarEventIdParamsSchema,
  createCalendarEventSchema,
  listCalendarEventsSchema,
  updateCalendarEventSchema,
} from "./calendar.schema.ts";

const router = express.Router();

router.post(
  "/",
  verifyUser(["admin"]),
  validateRequest(createCalendarEventSchema),
  calendarController.createCalendarEvent,
);

router.get(
  "/",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(listCalendarEventsSchema),
  calendarController.getCalendarEvents,
);

router.get(
  "/class/:classId",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(calendarClassParamsSchema),
  calendarController.getCalendarEventsByClass,
);

router.put(
  "/:id",
  verifyUser(["admin"]),
  validateRequest({
    ...calendarEventIdParamsSchema,
    ...updateCalendarEventSchema,
  }),
  calendarController.updateCalendarEvent,
);

router.delete(
  "/:id",
  verifyUser(["admin"]),
  validateRequest(calendarEventIdParamsSchema),
  calendarController.deleteCalendarEvent,
);

export default router;
