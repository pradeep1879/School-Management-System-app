import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { generatePayroll } from "../api/salary.api";

export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generatePayroll,

    onSuccess: (data) => {
      toast.success(data?.message || "Payroll generated successfully");

      queryClient.invalidateQueries({
        queryKey: ["teacher-salaries"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to generate payroll"
      );
    },
  });
};