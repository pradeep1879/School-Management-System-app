import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { paySalary } from "../api/salary.api";

export const usePaySalary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      salaryId,
      data,
    }: {
      salaryId: string;
      data: {
        amount: number;
        method: string;
        referenceNo?: string;
      };
    }) => paySalary(salaryId, data),

    onSuccess: (data) => {
      toast.success(data?.message || "Salary paid successfully");

      queryClient.invalidateQueries({
        queryKey: ["teacher-salaries"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to pay salary");
    },
  });
};