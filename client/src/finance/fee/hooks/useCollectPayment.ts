import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axios"
import { toast } from "sonner"

interface CollectPaymentPayload {
  installmentId: string
  amountPaid: number
  paymentMethod: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER"
}

export const useCollectPayment = (studentId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CollectPaymentPayload) => {
      const res = await api.post("/fees/collect", payload)
      return res.data
    },

    onSuccess: () => {
      toast.success("Payment collected successfully")

      // Refetch student fee summary
      queryClient.invalidateQueries({
        queryKey: ["student-fee-summary", studentId],
      })
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to collect payment"
      )
    },
  })
}