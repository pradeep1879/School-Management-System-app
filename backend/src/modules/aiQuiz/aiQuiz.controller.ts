import type { NextFunction, Request, Response } from "express";
import * as aiQuizService from "./aiQuiz.service.ts";

const getStudentId = (req: Request) => {
  if (!req.userId) {
    throw new Error("Unauthorized");
  }

  return req.userId;
};

export const generateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await aiQuizService.generateQuiz(req.body, getStudentId(req));
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const startQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await aiQuizService.startQuiz(String(req.params.quizId), getStudentId(req));
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await aiQuizService.submitQuiz(
      String(req.params.quizId),
      req.body.answers,
      getStudentId(req),
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getQuizResult = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await aiQuizService.getQuizResult(
      String(req.params.quizId),
      getStudentId(req),
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await aiQuizService.getQuizHistory(getStudentId(req), req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
