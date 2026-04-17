import { useMutation } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

export const useUpdateAttendanceSession = () => {
  return useMutation({
    mutationFn: async ({
      sessionId,
      exceptions,
    }: {
      sessionId: string;
      exceptions: any[];
    }) => {
      const res = await api.put(
        `/attendance/session/${sessionId}`,
        { exceptions }
      );
      console.log("use update attendance session", res)
      return res.data;
    },

    onSuccess: () => {
      toast.success("Attendance updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update attendance"
      );
    },
  });
};