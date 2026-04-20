import { useQuery } from "@tanstack/react-query";
import { getTeacherAttendanceProfile } from "../api/teacherAttendance.api";

export const useTeacherAttendanceProfile = (teacherId?: string) => {
  return useQuery({
    queryKey: ["teacher-attendance-profile", teacherId],
    queryFn: () => getTeacherAttendanceProfile(teacherId!),
    enabled: !!teacherId,
  });
};
