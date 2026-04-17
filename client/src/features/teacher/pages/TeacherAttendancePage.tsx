import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";

import { Skeleton } from "@/components/ui/skeleton";
import ClassAttendanceOverview from "@/features/attendance/components/ClassAttendanceOverview";

export default function TeacherAttendancePage() {
  const { data, isLoading } = useTeacherClass(true);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const classId = data?.classDetail?.id;

  if (!classId) return <p>No class assigned</p>;

  return (
    <ClassAttendanceOverview classId={classId} />
  );
}