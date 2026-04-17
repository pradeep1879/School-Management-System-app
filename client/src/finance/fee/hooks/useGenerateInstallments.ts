import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

export const useGenerateInstallments = () => {
  return useMutation({
    mutationFn: async (structureId: string) => {
      const res = await api.post(
        `/fees/generate-installments/${structureId}`
      );
      console.log("use generate installments", res)
      return res.data;
    },

    onSuccess: () => {
      toast.success("Installments generated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to generate installments"
      );
    },
  });
};