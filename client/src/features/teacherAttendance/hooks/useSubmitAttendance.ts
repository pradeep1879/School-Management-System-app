import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitAttendance } from "../api/teacherAttendance.api";
import { toast } from "sonner";

export const  useSubmitAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAttendance,

    onSuccess: (data) => {
      toast.success(data?.message);
       queryClient.invalidateQueries({
        queryKey: ["today-attendance"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};