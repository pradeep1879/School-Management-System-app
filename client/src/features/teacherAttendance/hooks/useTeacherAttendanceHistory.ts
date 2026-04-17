import { useQuery } from "@tanstack/react-query";
import { getTeacherAttendanceHistory, getTeacherAttendanceHistoryById,} from "../api/teacherAttendance.api";
import type { AttendanceRecord } from "../types/types";

export const useTeacherAttendanceHistory = () => {
  return useQuery({
    queryKey: ["teacher-attendance-history"],
    queryFn: getTeacherAttendanceHistory,
  });
};

export const useTeacherAttendanceHistoryById = (
  teacherId?: string,
  options?: any
) => {
  return useQuery<AttendanceRecord[]>({
    queryKey: ["teacher-attendance-history", teacherId],
    queryFn: () => getTeacherAttendanceHistoryById(teacherId!),
    ...options,
  });
};