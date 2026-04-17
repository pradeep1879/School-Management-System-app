import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface ClassFeeSummaryResponse {
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  todayCollection: number;
  paidStudents: number;
  overdueStudents: number;
}

export const useClassFeeSummary = (classId?: string) => {
  return useQuery<ClassFeeSummaryResponse>({
    queryKey: ["class-fee-summary", classId],

    queryFn: async () => {
      const res = await api.get(
        `/fees/class/${classId}/summary`
      );
      return res.data;
    },

    enabled: !!classId,
    staleTime: 1000 * 60 * 5, // 5 min cache

    placeholderData: {
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      todayCollection: 0,
      paidStudents: 0,
      overdueStudents: 0,
    },
  });
};