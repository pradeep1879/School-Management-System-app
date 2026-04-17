// @ts-nocheck
import * as attendanceService from "./attendance.service.ts";

export const markAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.markAttendance(
      req.body,
      req.userId
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceByDate = async (req, res, next) => {
  try {
    const data = await attendanceService.getAttendanceByDate(
      req.params.classId,
      req.query.date,
      req.userId,
      req.role
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const getStudentAttendanceHistory = async (req, res, next) => {
  try {
    const data = await attendanceService.getStudentAttendanceHistory(
      req.userId,
      req.query,
      req.userId,
      "student"
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const getStudentAttendanceById = async (
  req,
  res,
  next
) => {
  try {
    const { studentId } = req.params;

    const data =
      await attendanceService.getStudentAttendanceHistory(
        studentId,
        req.query,
        req.userId,
        req.role
      );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


/**
 * GET CLASS ATTENDANCE SUMMARY
 * Admin → Any class
 * Teacher → Only their class
 */
export const getClassAttendanceSummary = async (req, res, next) => {
  try {
    const { classId } = req.params;

    const data = await attendanceService.getClassAttendanceSummary(
      classId,
      req.userId,
      req.role
    );

    res.status(200).json({
      success: true,
      message: "Class attendance summary fetched successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttendanceSession = async (req, res, next) => {
  try {
    const data = await attendanceService.updateAttendanceSession(
      req.params.sessionId,
      req.body.exceptions,
      req.userId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
