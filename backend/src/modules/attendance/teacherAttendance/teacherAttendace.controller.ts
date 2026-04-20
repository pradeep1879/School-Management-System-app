// @ts-nocheck
import * as teacherAttendanceService from "./teacherAttendance.service.ts";

export const submitAttendance = async (req, res, next) => {
  try {
    const data = await teacherAttendanceService.submitTeacherAttendance(
      req.body,
      req.userId
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const data = await teacherAttendanceService.getMyTeacherAttendance(
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
export const getTodayAttendance = async (req, res, next) => {
  try {
    const teacherId = req.userId;

    const data =
      await teacherAttendanceService.getTodayAttendance(teacherId);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllTeacherAttendanceHistory = async (req, res, next) => {
  try {
    const data =
      await teacherAttendanceService.getAllTeacherAttendanceHistory();

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTeacherAttendanceStats = async (req, res, next) => {
  try {
    const data =
      await teacherAttendanceService.getTeacherAttendanceStats();

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getPendingAttendance = async (req, res, next) => {
  try {
    const data =
      await teacherAttendanceService.getPendingTeacherAttendance();

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const approveAttendance = async (req, res, next) => {
  try {
    const data = await teacherAttendanceService.approveTeacherAttendance(
      req.params.attendanceId,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const rejectAttendance = async (req, res, next) => {
  try {
    const data = await teacherAttendanceService.rejectTeacherAttendance(
      req.params.attendanceId,
      req.userId,
      req.body.reason
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTeacherAttendanceHistoryById = async (req, res, next) => {
  try {
    const data =
      await teacherAttendanceService.getTeacherAttendanceHistoryById(
        req.params.teacherId
      );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTeacherAttendanceProfile = async (req, res, next) => {
  try {
    const data =
      await teacherAttendanceService.getTeacherAttendanceProfile(
        req.params.teacherId
      );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
