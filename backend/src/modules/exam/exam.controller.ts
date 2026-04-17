// @ts-nocheck
import * as examService from "./exam.service.ts";

/* ================= CREATE ================= */

export const createExam = async (req, res, next) => {
  try {
    const data = await examService.createExam(
      req.body,
      req.userId,
      req.role
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= FETCH ================= */

export const getExamsByClass = async (req, res, next) => {
  try {
    const data = await examService.getExamsByClass(
      req.query.classId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= STATUS ================= */

export const updateExamStatus = async (req, res, next) => {
  try {
    const data = await examService.updateExamStatus(
      req.params.id,
      req.body.status,
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const publishExam = async (req, res, next) => {
  try {
    const data = await examService.publishExam(
      req.params.id,
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= MARKS ================= */

export const bulkUpdateMarks = async (req, res, next) => {
  try {
    const data = await examService.bulkUpdateMarks(
      req.body.updates,   //  standardized name
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const updateExamMarks = async (req, res, next) => {
  try {
    const data = await examService.updateExamMarks(
      req.params.id,
      req.body.obtainedMarks,
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

/* ================= STUDENT SUMMARY ================= */

export const getStudentExamSummary = async (req, res, next) => {
  try {
    const { examId, studentId } = req.query;

    const data = await examService.getStudentExamSummary(
      examId,
      studentId,
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};


export const getSubjectResults = async (req, res, next) => {
  try {
    const data = await examService.getSubjectResults(
      req.params.examId,
      req.params.subjectId,
      req.role,
      req.userId
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};


export const getExamResultsOverview = async (req, res, next) => {
  try {
    const data = await examService.getExamResultsOverview(
      req.params.examId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getStudentDetailedResult = async (req, res, next) => {
  try {
    const data = await examService.getStudentDetailedResult(
      req.params.examId,
      req.params.studentId,
      req.role,
      req.userId
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};
