// @ts-nocheck
import * as dashboardService from "./analytics.service.ts";

export const getAdminDashboard = async (req, res, next) => {
  try {

    const data = await dashboardService.getAdminDashboard();

    res.json(data);

  } catch (error) {
    next(error);
  }
};


export const getDailyAttendanceStats = async (req, res, next) => {
  try {

    const days = Number(req.query.days) || 7;

    const data = await dashboardService.getDailyAttendanceStats(days);

    res.status(200).json({
      message: "Daily attendance analytics fetched",
      data
    });

  } catch (error) {
    next(error);
  }
};




export const getStudentPerformanceTrend = async (req, res, next) => {
  try {

    const { studentId } = req.params;

    const data = await dashboardService.getStudentPerformanceTrend(studentId);

    res.json({
      success: true,
      ...data
    });

  } catch (error) {
    next(error);
  }
};

export const getStudentExamSubjects = async (req, res) => {
  try {

    const { studentId, examId } = req.params;

    if (!studentId || !examId) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Exam ID are required",
      });
    }

    const data = await dashboardService.getStudentExamSubjects(
      studentId,
      examId
    );

    return res.status(200).json({
      success: true,
      studentId,
      ...data,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exam subjects",
    });

  }
};


export const getStudentExamPerformance = async (req, res, next) => {
  try {

    const { studentId } = req.params;

    const data =
      await dashboardService.getStudentExamPerformance(studentId);

    res.json({
      success: true,
      ...data
    });

  } catch (error) {
    next(error);
  }
};


export const getExamAnalyticsController = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({
        success: false,
        message: "Exam ID required",
      });
    }

    const analytics = await dashboardService.getExamAnalytics(examId);

    return res.status(200).json({
      success: true,
      message: "Exam analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

