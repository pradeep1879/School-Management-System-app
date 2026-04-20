import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
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
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);

  return useQuery<AttendanceRecord[]>({
    queryKey: ["my-attendance", role, userId],
    queryFn: getMyAttendance,
    enabled: role === "teacher" && Boolean(userId),
    ...options,
  });
};




export const useTodayAttendance = () => {
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);

  return useQuery({
    queryKey: ["today-attendance", role, userId],
    queryFn: getTodayAttendance,
    enabled: role === "teacher" && Boolean(userId),
  });
};
