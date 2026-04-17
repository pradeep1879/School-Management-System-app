import { useParams } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";
import { useSyllabus, useUpdateChapterStatus } from "../hooks/useSyllabus";
import SyllabusSkeleton from "@/skeletons/SyllabusSkeleton";
import ChapterCard from "../components/ChapterCard";


export default function SyllabusPage() {
  const { subjectId } = useParams();
  const role = useAuthStore((s) => s.role);

  const { data, isLoading } = useSyllabus(subjectId || "");

  const updateStatusMutation = useUpdateChapterStatus();

  const chapters = data?.chapters || [];

  const handleStatusChange = (chapterId: string, status: string) => {
    updateStatusMutation.mutate({
      chapterId,
      status,
    });
  };

  if (!subjectId) {
    return <div>Invalid Subject</div>;
  }

  if (isLoading) {
    return <SyllabusSkeleton />;

  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No syllabus added yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Subject Syllabus
      </h2>

      <div className="space-y-4">
        {chapters.map((chapter: any, index: number) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            role={role}
            onStatusChange={handleStatusChange}
          />
        ))}
    </div>
    </div>
  );
}