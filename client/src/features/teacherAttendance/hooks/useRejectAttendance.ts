import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAttendance } from "../api/teacherAttendance.api";
import { toast } from "sonner";

export const useRejectAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectAttendance,

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