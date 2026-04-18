// @ts-nocheck
import * as feeAnalytics from "./fee.analytics.ts";
import * as feeService from "./fee.service.ts";

export const createFeeStructure = async (req, res, next) => {
  try {
    const data = await feeService.createFeeStructure(
      req.body,
      req.role,
      req.userId
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const addFeeComponent = async (req, res, next) => {
  try {
    const data = await feeService.addFeeComponent(
      req.body,
      req.userId
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const generateInstallmentsForStructure = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await feeService.generateInstallmentsForStructure(
        req.params.structureId,
        req.userId
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const collectPayment = async (req, res, next) => {
  try {
    const data = await feeService.collectPayment(
      req.body,
      req.userId
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getStudentFeeSummary = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await feeService.getStudentFeeSummary(
        req.params.studentId
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getClassFeeSummary = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await feeService.getClassFeeSummary(
        req.params.classId
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAdminFinanceSummary = async (req, res) => {
  try {
    const summary = await feeService.getAdminFinanceSummary();

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin finance summary",
    });
  }
};

export const getMyFeeSummary = async (
  req,
  res,
  next
) => {
  try {
    const data =
      await feeService.getStudentFeeSummary(
        req.userId
      );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};



export const getFinanceDashboard = async (req, res, next) => {
  try {
    const data = await feeAnalytics.getFinanceDashboard();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error)

  }
};
