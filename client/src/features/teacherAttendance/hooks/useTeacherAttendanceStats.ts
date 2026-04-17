import { useQuery } from "@tanstack/react-query";
import { getTeacherAttendanceStats } from "../api/teacherAttendance.api";

export const useTeacherAttendanceStats = () => {
  return useQuery({
    queryKey: ["teacher-attendance-stats"],
    queryFn: getTeacherAttendanceStats,
  });
};