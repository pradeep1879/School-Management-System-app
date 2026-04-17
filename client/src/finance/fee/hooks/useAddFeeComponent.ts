import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

interface AddFeeComponentPayload {
  feeStructureId: string;
  name: string;
  amount: number;
  frequency: "MONTHLY" | "QUARTERLY" | "YEARLY" | "ONE_TIME";
  isOptional?: boolean;
}

export const useAddFeeComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddFeeComponentPayload) => {
      const res = await api.post("/fees/component", payload);
      console.log("useAddFeecomponent", res)
      return res.data;
    },

    onSuccess: () => {
      toast.success("Fee component added successfully");
      queryClient.invalidateQueries({ queryKey: ["fee-components"] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to add fee component"
      );
    },
  });
};