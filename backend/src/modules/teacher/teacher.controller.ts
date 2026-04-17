// @ts-nocheck
import * as teacherService from "./teacher.service.ts";

export const createTeacher = async (req, res, next) => {
  try {
    const data = await teacherService.createTeacher(
      req.body,
      req.files,
      req.userId
    );

    res.status(201).json(data);
  } catch (error) {
    next(error); // let global middleware handle
  }
};

export const loginTeacher = async (req, res, next) => {
  try {
    const data = await teacherService.teacherLogin(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const logout = async (req, res, next) => {
  try {
    const data = await teacherService.logout(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const getAllTeachers = async (req, res, next) => {
  try {
    const data = await teacherService.getAllTeachers(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const getTeacherById = async (req, res, next) => {
  try {
    const data = await teacherService.getTeacherById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getTeacherClass = async (req, res, next) => {
  try {
    const data = await teacherService.getTeacherClass(req.userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};


export const getProfile = async (req, res, next) => {
  try {
    const data = await teacherService.getTeacherProfile(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const updateMyProfile = async (req, res, next) => {
  try {
    const data = await teacherService.updateMyProfile(
      req.userId,
      req.body
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
