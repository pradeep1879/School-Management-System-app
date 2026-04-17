import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import * as announcementController from "./announcement.controller.ts";
import {
  announcementIdParamsSchema,
  createAnnouncementSchema,
  listAnnouncementsSchema,
} from "./announcement.schema.ts";

const router = express.Router();

router.post(
  "/",
  verifyUser(["admin", "teacher"]),
  validateRequest(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

router.get(
  "/",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(listAnnouncementsSchema),
  announcementController.getAnnouncements,
);

router.patch(
  "/:id/read",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(announcementIdParamsSchema),
  announcementController.markAnnouncementRead,
);

export default router;
