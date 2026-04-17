import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import api from "@/api/axios";


interface AttendanceRecord {
  id: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY";
  student: {
    id: string;
    studentName: string;
    rollNumber: string;
  };
}

export interface GetAttendanceResponse {
  message: string;
  sessionId:string,
  attendance: AttendanceRecord[];
}

interface Props {
  classId: string;
  date: Date;
  enabled: boolean;
}
  
export const useGetAttendanceByDate = ({
  classId,
  date,
  enabled,
}: Props) => {
  return useQuery<GetAttendanceResponse>({
    queryKey: ["attendance", classId, format(date, "yyyy-MM-dd")],

    queryFn: async () => {
      const res = await api.get(
        `/attendance/class/${classId}?date=${format(
          date,
          "yyyy-MM-dd"
        )}`
      );
      return res.data;
    },

    enabled,
    retry: false,
  });
};