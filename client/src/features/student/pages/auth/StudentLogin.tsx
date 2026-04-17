import { LoginCard } from "@/components/auth/LoginCard";
import { useStudentLogin } from "../../hooks/useLoginStudent";

export default function StudentLogin() {
  const loginMutation = useStudentLogin();

  return (
    <LoginCard
      role="student"
      title="Student Login"
      description="Sign in to view your timetable, homework, exam results, and personalized AI practice."
      identifierKey="userName"
      identifierLabel="Username"
      identifierPlaceholder="Enter your username"
      identifierType="text"
      submitLabel="Login as Student"
      isLoading={loginMutation.isPending}
      serverError={
        loginMutation.isError ? "Invalid username or password" : null
      }
      onSubmit={(values) => {
        loginMutation.mutate({
          userName: values.userName ?? "",
          password: values.password,
        });
      }}
    />
  );
}
