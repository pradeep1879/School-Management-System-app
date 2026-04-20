import type { Request, Response } from "express";
import * as timetableService from "./timetable.service.ts";

export const createTimetableSlot = async (req: Request, res: Response) => {
  const result = await timetableService.createTimetableSlot(
    req.body,
    req.userId!,
  );

  res.status(201).json(result);
};

export const updateTimetableSlot = async (req: Request, res: Response) => {
  const result = await timetableService.updateTimetableSlot(
    String(req.params.id),
    req.body,
    req.userId!,
  );

  res.json(result);
};

export const deleteTimetableSlot = async (req: Request, res: Response) => {
  const result = await timetableService.deleteTimetableSlot(
    String(req.params.id),
    req.userId!,
  );

  res.json(result);
};

export const getTimetableByClass = async (req: Request, res: Response) => {
  const result = await timetableService.getTimetableByClass(
    String(req.params.classId),
    req.role!,
    req.userId!,
  );

  res.json(result);
};

export const getMyTimetable = async (req: Request, res: Response) => {
  const result = await timetableService.getMyTimetable(
    req.role!,
    req.userId!,
  );

  res.json(result);
};
