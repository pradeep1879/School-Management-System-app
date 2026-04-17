import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { loginStudent } from "../api/student.api";

export const useStudentLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginStudent,

    onSuccess: (res) => {
      const { token, student } = res.data;

      setAuth({
        token,
        role: "student",
        userId: student.id,
      });

      toast.success("Welcome back 🎉");

      navigate("/student/dashboard");
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    },
  });
};