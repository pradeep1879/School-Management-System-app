import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.ts";
import { validateRequest } from "../../middlewares/validate.middleware.ts";
import * as aiQuizController from "./aiQuiz.controller.ts";
import {
  aiQuizHistoryQuerySchema,
  aiQuizParamsSchema,
  generateAIQuizSchema,
  submitAIQuizSchema,
} from "./aiQuiz.schema.ts";

const router = express.Router();

router.use(verifyUser(["student"]));

router.get("/history", validateRequest(aiQuizHistoryQuerySchema), aiQuizController.getQuizHistory);
router.post("/generate", validateRequest(generateAIQuizSchema), aiQuizController.generateQuiz);
router.post("/start/:quizId", validateRequest(aiQuizParamsSchema), aiQuizController.startQuiz);
router.post("/submit/:quizId", validateRequest(submitAIQuizSchema), aiQuizController.submitQuiz);
router.get("/:quizId/result", validateRequest(aiQuizParamsSchema), aiQuizController.getQuizResult);

export default router;
