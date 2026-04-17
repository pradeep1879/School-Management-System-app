import { Skeleton } from "@/components/ui/skeleton";
import ActivitiesSection from "@/features/activity/pages/ClassActivityPage";
import { useStudentProfile } from "@/features/student/hooks/useStudentProfile";


export default function StudentActivityPage() {
  const { data, isLoading } = useStudentProfile();
  console.log("student activity page", data)
  const classId = data?.student?.class?.id;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!classId) return <p>Class not found</p>;

  return <ActivitiesSection classId={classId} canEdit={false} />;
}