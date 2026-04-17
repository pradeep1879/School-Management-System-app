import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
import SubjectsSection from "@/features/subject/components/SubjectsSection";


export default function TeacherSubjectsPage() {
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

  return <SubjectsSection classId={classId} canEdit />;
}