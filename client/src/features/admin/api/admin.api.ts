import api from "@/api/axios";
import type { DailyAttendance, DashboardAnalytics } from "../types/analytics.types";

export const adminLogin = (data: any) =>
  api.post("/admin/login", data);

export const getDashboard = () =>
  api.get("/admin/dashboard");

export const getProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
}

export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
  const res = await api.get("/analytics");
  return res.data;
};

export const adminLogout = async () => {
  const res = await api.post("/admin/logout");
  return res.data;
};

export const updateAdminProfile = (data: {
  email?: string
  oldPassword?: string;
  password?: string
  confirmPassword?: string
}) => {
  return api.patch("/admin/profile", data)
}


export const getDailyAttendance = async (
  days: number = 7
): Promise<DailyAttendance[]> => {

  const res = await api.get(`/analytics/daily-attendance?days=${days}`)

  return res.data.data
}


