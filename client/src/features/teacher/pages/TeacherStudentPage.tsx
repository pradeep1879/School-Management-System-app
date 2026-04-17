
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
import StudentsTable from "@/features/student/components/table/StudentTable";



export default function TeacherStudentsPage() {
  const { data, isLoading } = useTeacherClass(true);

  console.log("teacher STudent Page", data)

  const classId = data?.classDetail?.id;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!classId) {
    return <p>Class not assigned</p>;
  }

  return (
    <StudentsTable
      classId={classId}
      profileBasePath="/teacher"
    />
  );
}