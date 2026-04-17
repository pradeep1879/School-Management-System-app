// @ts-nocheck
import * as syllabusService from "./syllabus.service.ts";

export const createChapter = async (req, res, next) => {
  try {
    const data = await syllabusService.createChapter(
      req.body,
      req.role
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const createChaptersBulk = async (req, res, next) => {
  try {
    const data = await syllabusService.createChaptersBulk(
      req.body,
      req.role
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getChaptersBySubject = async (req, res, next) => {
  try {
    const data =
      await syllabusService.getChaptersBySubject(
        req.params.subjectId
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateChapterStatus = async (req, res, next) => {
  try {
    const data =
      await syllabusService.updateChapterStatus(
        req.params.chapterId,
        req.body.status,
        req.role
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const data = await syllabusService.deleteChapter(
      req.params.chapterId,
      req.role
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
