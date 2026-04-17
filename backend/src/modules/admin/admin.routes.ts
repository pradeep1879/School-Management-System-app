import express from "express";
import * as adminController from "./admin.controller.ts";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import {
  adminLoginSchema,
  adminSignupSchema,
  adminUpdateProfileSchema,
} from "./admin.schema.ts";

const router = express.Router();


// Public Routes


// Admin signup
router.post("/signup", validateRequest(adminSignupSchema), adminController.signup);

// Admin login
router.post("/login", validateRequest(adminLoginSchema), adminController.login);

router.post("/logout", adminController.logout);


// Protected Routes

// Admin dashboard
router.get("/dashboard", verifyUser(["admin"]), adminController.dashboard);

// Admin profile (optional but recommended)
router.get("/profile", verifyUser(["admin"]), adminController.getProfile);

router.patch(
  "/profile",
  verifyUser(["admin"]),
  validateRequest(adminUpdateProfileSchema),
  adminController.updateMyProfile,
);


export default router;
