import { useQuery } from "@tanstack/react-query";
import { getDailyAttendance, getDashboardAnalytics } from "../api/admin.api";

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: getDashboardAnalytics,
  });
};


export const useDailyAttendance = (days: number = 7) => {

  return useQuery({
    queryKey: ["analytics", "daily-attendance", days],
    queryFn: () => getDailyAttendance(days)
  })

}