// @ts-nocheck
import * as adminService from "./admin.service.ts";

export const signup = async (req, res, next) => {
  try {
    const data = await adminService.signup(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await adminService.login(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const data = await adminService.logout(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const data = await adminService.getProfile(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const dashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardData(req.userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};


export const updateMyProfile = async (req, res, next) => {
  try {
    const data = await adminService.updateMyProfile(
      req.userId,
      req.body
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

