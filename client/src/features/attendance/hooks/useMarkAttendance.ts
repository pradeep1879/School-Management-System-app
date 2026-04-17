// features/attendance/hooks/useMarkAttendance.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAttendance } from "../api/attendance.api";
import { toast } from "sonner";

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendance,

    onSuccess: () => {
      toast.success("Attendance marked successfully");

      // refresh attendance pages
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });

      // refresh dashboard analytics
      queryClient.invalidateQueries({
        queryKey: ["analytics", "dashboard"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    },
  });
};