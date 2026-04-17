import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveAttendance } from "../api/teacherAttendance.api";
import { toast } from "sonner";

export const useApproveAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveAttendance,

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({
        queryKey: ["pending-teacher-attendance"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};