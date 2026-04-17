import express from "express";
import * as activityController from "./activity.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  createActivitySchema,
  getActivitiesByClassSchema,
  getActivityByIdSchema,
  updateActivityStatusSchema,
} from "./activity.schema.ts";

const router = express.Router();

// Create (admin + teacher)
router.post(
  "/",
  verifyUser(["admin", "teacher"]),
  validateRequest(createActivitySchema),
  activityController.createActivity,
);

// Get by class
router.get(
  "/",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(getActivitiesByClassSchema),
  activityController.getActivitiesByClass,
);

// Get single
router.get(
  "/:id",
  verifyUser(["admin", "teacher", "student"]),
  validateRequest(getActivityByIdSchema),
  activityController.getActivityById,
);

// Update status (admin + teacher only)
router.patch(
  "/:id/status",
  verifyUser(["admin", "teacher"]),
  validateRequest(updateActivityStatusSchema),
  activityController.updateActivityStatus,
);

export default router;
