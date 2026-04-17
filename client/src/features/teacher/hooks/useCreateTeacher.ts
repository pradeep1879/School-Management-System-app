import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeacher, teacherLogin } from "../api/teacher.api";
import { toast } from "sonner"; // or shadcn toast hook

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeacher,

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message);
    },
  });
};

export const useTeacherLogin = () => {
  return useMutation({
    mutationFn: teacherLogin,

    onSuccess: (data) => {
      toast.success(data?.message);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
};