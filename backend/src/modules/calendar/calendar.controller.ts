import type { Request, Response } from "express";
import * as calendarService from "./calendar.service.ts";

export const createCalendarEvent = async (req: Request, res: Response) => {
  const result = await calendarService.createCalendarEvent(
    req.body,
    req.userId!,
  );

  res.status(201).json(result);
};

export const updateCalendarEvent = async (req: Request, res: Response) => {
  const result = await calendarService.updateCalendarEvent(
    String(req.params.id),
    req.body,
    req.userId!,
  );

  res.json(result);
};

export const deleteCalendarEvent = async (req: Request, res: Response) => {
  const result = await calendarService.deleteCalendarEvent(
    String(req.params.id),
    req.userId!,
  );

  res.json(result);
};

export const getCalendarEvents = async (req: Request, res: Response) => {
  const result = await calendarService.getCalendarEvents(
    req.role!,
    req.userId!,
    req.query,
  );

  res.json(result);
};

export const getCalendarEventsByClass = async (
  req: Request,
  res: Response,
) => {
  const result = await calendarService.getCalendarEventsByClass(
    String(req.params.classId),
    req.role!,
    req.userId!,
  );

  res.json(result);
};
