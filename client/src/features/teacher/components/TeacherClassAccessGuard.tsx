import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";

type TeacherClassAccessGuardProps = {
  children: ReactNode;
};

export default function TeacherClassAccessGuard({
  children,
}: TeacherClassAccessGuardProps) {
  const { data, isLoading } = useTeacherClass(true);

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-xl" />;
  }

  if (!data?.classDetail?.id) {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <>{children}</>;
}
