// @ts-nocheck
import * as homeworkService from "./homework.service.ts";

export const createHomework = async (req, res, next) => {
  try {
    const data = await homeworkService.createHomework(
      req.body,
      req.userId,
      req.role
    );

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getHomeworkByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;

    const data = await homeworkService.getHomeworkByClass(
      classId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateHomeworkStatus = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;
    const { status } = req.body;

    const data = await homeworkService.updateHomeworkStatus(
      homeworkId,
      status,
      req.userId,
      req.role
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteHomework = async (req, res, next) => {
  try {
    const { homeworkId } = req.params;

    const data = await homeworkService.deleteHomework(
      homeworkId,
      req.userId,
      req.role
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
