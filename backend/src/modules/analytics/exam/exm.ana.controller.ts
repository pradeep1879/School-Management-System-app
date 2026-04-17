// @ts-nocheck
import * as examAnalyticsService from "./exm.ana.service.ts";

export const getExamAnalytics = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const data = await examAnalyticsService.getExamAnalytics(examId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
