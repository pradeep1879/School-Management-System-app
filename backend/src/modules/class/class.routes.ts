import express from "express";
import * as classController from "./class.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  classByIdParamsSchema,
  classIdParamsSchema,
  classListQuerySchema,
  createClassSchema,
  updateClassSchema,
} from "./class.schema.ts";

const router = express.Router();

// Admin creates class
router.post("/", verifyUser(["admin"]), validateRequest(createClassSchema), classController.createClass);
router.patch("/:classId", verifyUser(["admin"]), validateRequest(updateClassSchema), classController.updateClass);
router.delete("/:classId", verifyUser(["admin"]), validateRequest(classIdParamsSchema),classController.deleteClass);

// Get all classes (admin)
router.get("/", verifyUser(["admin"]), validateRequest(classListQuerySchema), classController.getAllClasses);

router.get("/dropdown", verifyUser(["admin"]),  classController.getClassDropdown);

// GET /api/v1/classes/:id
router.get("/:id", verifyUser(["admin"]), validateRequest(classByIdParamsSchema), classController.getClassById);

export default router;
