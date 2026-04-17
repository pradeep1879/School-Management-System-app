// @ts-nocheck
import * as activityService from "./activity.service.ts";

export const createActivity = async (req, res, next) => {
  try {
    const data = await activityService.createActivity(
      req.body,
      req.userId,
      req.role
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getActivitiesByClass = async (req, res, next) => {
  try {
    const data = await activityService.getActivitiesByClass(
      req.query.classId
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const data = await activityService.getActivityById(
      req.params.id
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateActivityStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data =
      await activityService.updateActivityStatus(
        id,
        status,
        req.role,
        req.userId
      );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
