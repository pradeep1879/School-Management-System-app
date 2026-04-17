import { useQuery } from "@tanstack/react-query";
import { getMyAttendance } from "../api/teacherAttendance.api";
import { getTodayAttendance } from "../api/teacherAttendance.api";

type AttendanceRecord = {
  id: string;
  date: string;
  status: string;
  approvalStatus: string;
  note?: string;
};

export const useMyAttendance = (options?: any) => {
  return useQuery<AttendanceRecord[]>({
    queryKey: ["my-attendance"],
    queryFn: getMyAttendance,
    ...options,
  });
};




export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["today-attendance"],
    queryFn: getTodayAttendance,
  });
};