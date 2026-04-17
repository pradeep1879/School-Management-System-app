import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface StudentAttendance {
  id: string;
  studentName: string;
  rollNumber: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  attendancePercentage: string;
}

export interface ClassAttendanceSummary {
  classSummary: {
    totalStudents: number;
    totalSessions: number;
    averageAttendance: string;
  };
  students: StudentAttendance[];
}

export const useClassAttendanceSummary = (classId: string) => {
  return useQuery<ClassAttendanceSummary>({
    queryKey: ["class-attendance-summary", classId],
    queryFn: async () => {
      const res = await api.get(
        `/attendance/class/${classId}/summary`
      );
      return res.data;
    },
    enabled: !!classId,
  });
};