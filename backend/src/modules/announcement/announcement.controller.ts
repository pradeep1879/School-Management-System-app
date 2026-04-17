import type { NextFunction, Request, Response } from "express";
import * as announcementService from "./announcement.service.ts";
import type { AppRole } from "../../types/auth.types";

const getAuthContext = (req: Request) => {
  if (!req.userId || !req.role) {
    throw new Error("Unauthorized");
  }

  return {
    userId: req.userId,
    role: req.role as AppRole,
  };
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = getAuthContext(req);
    const data = await announcementService.createAnnouncement(
      req.body,
      userId,
      role,
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = getAuthContext(req);
    const data = await announcementService.getAnnouncements(
      userId,
      role,
      req.query,
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const markAnnouncementRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = getAuthContext(req);
    const data = await announcementService.markAnnouncementRead(
      String(req.params.id),
      userId,
      role,
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
