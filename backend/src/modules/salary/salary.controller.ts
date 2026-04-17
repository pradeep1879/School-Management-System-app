// @ts-nocheck
import * as teacherSalaryService from "./salary.service.ts";

export const generatePayroll = async (req, res, next) => {
  try {
    const data = await teacherSalaryService.generateMonthlyPayroll(
      req.body,
      req.userId
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllSalaries = async (req, res, next) => {
  try {
    const data = await teacherSalaryService.getAllTeacherSalaries();

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const paySalary = async (req, res, next) => {
  try {
    const data = await teacherSalaryService.payTeacherSalary(
      req.params.salaryId,
      req.body
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getMySalary = async (req, res, next) => {
  try {
    const data = await teacherSalaryService.getMySalaryHistory(
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};
