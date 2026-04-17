import { Skeleton } from "@/components/ui/skeleton";
import { useStudentProfile } from "@/features/student/hooks/useStudentProfile";
import SubjectsSection from "@/features/subject/components/SubjectsSection";


export default function StudentSubjectsPage() {
  const { data, isLoading } = useStudentProfile();
  const classId = data?.student?.class?.id;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!classId) return <p>Class not found</p>;

  return (
    <SubjectsSection
      classId={classId}
      canEdit={false}
    />
  );
}