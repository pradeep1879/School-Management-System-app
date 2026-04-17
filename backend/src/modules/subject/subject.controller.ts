// @ts-nocheck
import * as subjectService from "./subject.service.ts";

export const createSubject = async (req, res, next) => {
  try {
    const data = await subjectService.createSubject(req.body, req.userId);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllSubjects = async (req, res, next) => {
  try {
    const data = await subjectService.getAllSubjects(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getSubjectById = async (req, res, next) => {
  try {
    const data = await subjectService.getSubjectById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const deleteSubject = async (req, res, next) => {
  try {
    const data = await subjectService.deleteSubject(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const assignTeacher = async (req, res, next) => {
  try {
    const { teacherId } = req.body;
    const data = await subjectService.assignTeacherToSubject(
      req.params.id,
      teacherId
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
