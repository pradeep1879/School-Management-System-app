
import api from "@/api/axios";

export interface AttendanceException {
  studentId: string;
  status: "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY";
}

export interface MarkAttendancePayload {
  classId: string;
  date: string;
  exceptions: AttendanceException[];
}

export const markAttendance = async (payload: MarkAttendancePayload) => {
  const { data } = await api.post("/attendance/bulk", payload);
  return data;
};