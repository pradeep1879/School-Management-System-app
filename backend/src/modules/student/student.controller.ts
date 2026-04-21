// @ts-nocheck
import * as studentService from "./student.service.ts";

export const createStudent = async (req, res, next) => {
  try {
    const data = await studentService.createStudent(
      req.body,
      req.files,
      req.userId
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const loginStudent = async (req, res, next) => {
  try {
    const data = await studentService.loginStudent(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const data = await studentService.logout(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const data = await studentService.getMyProfile(
      req.userId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMyClass = async (req, res, next) => {
  try {
    const data = await studentService.getMyClass(req.userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await studentService.getDashboardSummary(req.userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getStudentsByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;

    const data = await studentService.getStudentsByClass(
      classId,
      req.query,
      req.role,
      req.userId
    );

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};


export const getStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const data = await studentService.getStudentById(
      studentId,
      req.role,
      req.userId
    );

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllStudents = async (req, res, next) => {
  try {
    const data = await studentService.getAllStudents(
      req.query,
      req.userId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const data = await studentService.updateMyProfile(
      req.userId,
      req.body
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
