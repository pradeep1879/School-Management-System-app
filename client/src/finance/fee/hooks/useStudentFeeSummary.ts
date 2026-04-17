import { useQuery } from "@tanstack/react-query"
import api from "@/api/axios"

export interface FeeSummaryResponse {
  summary: {
    totalAmount: number
    paidAmount: number
    dueAmount: number
  }
  installments: {
    id: string
    title: string
    amount: number
    dueDate: string
    status: "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE"
  }[]
  payments: {
    id: string
    receiptNo: string
    amount: number
    paymentDate: string
    method: string
  }[]
}

export const useStudentFeeSummary = (
  studentId?: string
) => {
  return useQuery<FeeSummaryResponse>({
    queryKey: ["student-fee-summary", studentId],

    queryFn: async () => {
      const res = await api.get(
        `/fees/student/${studentId}`
      )
      return res.data
    },

    enabled: !!studentId,
  })
}