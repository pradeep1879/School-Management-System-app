import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface AttendanceHistory {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY";
}

export interface StudentAttendanceResponse {
  summary: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    leave: number;
    holiday: number;
    attendancePercentage: string;
  };
  history: AttendanceHistory[];
}

export const useStudentAttendance = (studentId?: string) => {
  return useQuery<StudentAttendanceResponse>({
    queryKey: ["student-attendance", studentId],
    queryFn: async () => {
      const res = await api.get(
        `/attendance/student/${studentId}`
      );
      return res.data;
    },
    enabled: !!studentId,
  });
};