// @ts-nocheck
import * as classService from './class.service.ts'

export const createClass = async (req, res, next) => {
  try {
    const data = await classService.createClass(
      req.body,
      req.userId
    )
    res.status(201).json(data);
  } catch (error) {
    next(error)
  }
}

export const updateClass = async(req, res, next) =>{
  try {
    const { classId } = req.params;
    const data = await classService.updateClass(
      req.body,
      req.userId,
      classId
    );
    return res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

export const deleteClass = async (req, res, next) => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({
        message: "Class ID is required",
      });
    }

    const data = await classService.deleteClass(
      classId,
      req.userId 
    );

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAllClasses = async (req, res, next) => {
  try {
    const data = await classService.getAllClasses(
      req.query,
      req.userId
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getClassDropdown = async (req, res, next) => {
  try {
    const data = await classService.getClassDropdown(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (req, res, next) => {
  try {
    const data = await classService.getClassById(
      req.params.id,
      req.userId
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
