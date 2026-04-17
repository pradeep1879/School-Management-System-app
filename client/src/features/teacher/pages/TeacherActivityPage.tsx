import { Skeleton } from "@/components/ui/skeleton";
import ActivitiesSection from "@/features/activity/pages/ClassActivityPage";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";


export default function TeacherActivityPage() {
  const { data, isLoading } = useTeacherClass(true);
  const classId = data?.classDetail?.id;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!classId) return <p>Class not assigned</p>;

  return <ActivitiesSection classId={classId} canEdit />;
}