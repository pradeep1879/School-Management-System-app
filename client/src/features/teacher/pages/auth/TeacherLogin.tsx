import { useNavigate } from "react-router-dom";

import { LoginCard } from "@/components/auth/LoginCard";
import { useAuthStore } from "@/store/auth.store";
import { useTeacherLogin } from "../../hooks/useCreateTeacher";

export default function TeacherLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const loginMutation = useTeacherLogin();

  return (
    <LoginCard
      role="teacher"
      title="Teacher Login"
      description="Sign in to access your classes, manage attendance, and stay on top of student progress."
      identifierKey="email"
      identifierLabel="Email"
      identifierPlaceholder="teacher@schoolerp.com"
      identifierType="email"
      submitLabel="Login as Teacher"
      isLoading={loginMutation.isPending}
      serverError={
        loginMutation.isError ? "Invalid email or password" : null
      }
      onSubmit={(values) => {
        loginMutation.mutate(
          {
            email: values.email,
            password: values.password,
          },
          {
            onSuccess: (res) => {
              setAuth({
                token: res.token,
                role: "teacher",
                userId: res.teacher.id,
              });

              navigate("/teacher/dashboard");
            },
          },
        );
      }}
    />
  );
}
