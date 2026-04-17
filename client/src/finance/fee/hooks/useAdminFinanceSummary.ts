import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface AdminFinanceSummary {
  totalRevenue: number;
  totalCollected: number;
  totalDue: number;
  todayCollection: number;
  totalStudents: number;
  overdueStudents: number;
  classes: {
    id: string;
    className: string;
    total: number;
    paid: number;
    due: number;
  }[];
  recentPayments: {
    id: string;
    studentName: string;
    amount: number;
    paymentDate: string;
    method: string;
  }[];
  overdueList: {
    id: string;
    studentName: string;
    className: string;
    dueAmount: number;
  }[];
}

export const useAdminFinanceSummary = () => {
  return useQuery<AdminFinanceSummary>({
    queryKey: ["admin-finance-summary"],
    queryFn: async () => {
      const res = await api.get("/fees/admin/summary");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};