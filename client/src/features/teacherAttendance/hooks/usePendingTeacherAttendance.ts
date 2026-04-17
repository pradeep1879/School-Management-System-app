import { useQuery } from "@tanstack/react-query";
import { getPendingAttendance } from "../api/teacherAttendance.api";

export const usePendingTeacherAttendance = () => {
  return useQuery({
    queryKey: ["pending-teacher-attendance"],
    queryFn: getPendingAttendance,
  });
};