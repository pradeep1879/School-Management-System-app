import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "../api/student.api";
import { toast } from "sonner";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudent,

    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create student"
      );
    },
  });
};


