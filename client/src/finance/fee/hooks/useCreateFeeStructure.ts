import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

interface CreateFeeStructurePayload {
  classId: string;
  session: string;
  lateFeeType: "NONE" | "FIXED" | "DAILY";
  lateFeeAmount: number;
}

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFeeStructurePayload) => {
      const res = await api.post("/fees/structure", payload);
      console.log("use CreateFee Structure", res)
      return res.data;
    },

    onSuccess: (data:any) => {
      toast.success(data?.message ||"Fee structure created successfully");
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
      return data.structure;
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create fee structure"
      );
    },
  });
};