import api from "@/api/axios";

/**
 * Generate Payroll (Admin)
 */
export const generatePayroll = async (data: {
  month: number;
  year: number;
}) => {
  const res = await api.post("/teacher/salary/generate", data);
  return res.data;
};

/**
 * Get All Teacher Salaries (Admin)
 */
export const getTeacherSalaries = async () => {
  const res = await api.get("/teacher/salary");
  return res.data;
};

/**
 * Pay Salary (Admin)
 */
export const paySalary = async (
  salaryId: string,
  data: {
    amount: number;
    method: string;
    referenceNo?: string;
  }
) => {
  const res = await api.patch(`/teacher/salary/${salaryId}/pay`, data);
  return res.data;
};

/**
 * Teacher → My Salary History
 */
export const getMySalary = async () => {
  const res = await api.get("/teacher/salary/me");
  return res.data;
};