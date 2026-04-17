import { useNavigate } from "react-router-dom";
import { Calendar, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useExams } from "@/features/exam/hooks/useExam";
import { useCurrentClass } from "@/features/class/hooks/useCurrentClass";

export default function StudentExamListPage() {
  const navigate = useNavigate();

  const { classId, isLoading: classLoading } = useCurrentClass();

  const { data, isLoading } = useExams(classId);

  if (classLoading || isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading exams...
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="text-center py-10 text-red-500">Class not found</div>
    );
  }

  const exams =
    data?.exams?.filter(
      (exam: any) => exam.status === "PUBLISHED" || "CANCELLED",
    ) || [];

  if (exams.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No published exams yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">My Exams</h2>
        <p className="text-sm text-muted-foreground">
          View your published exam results
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam: any) => {
          const isCancelled = exam.status === "CANCELLED";

          return (
            <Card
              key={exam.id}
              className={`transition
          ${!isCancelled ? "cursor-pointer hover:shadow-lg" : "opacity-60 cursor-not-allowed"}
        `}
              onClick={() => {
                if (!isCancelled) {
                  navigate(`/student/exam/${exam.id}`);
                }
              }}
            >
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {exam.examType}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(exam.startDate).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen size={14} />
                  <span className="text-sm">
                    {exam.subjects?.length} Subjects
                  </span>
                </div>

                {exam.status === "PUBLISHED" ? (
                  <Badge className="bg-blue-100 text-blue-700">PUBLISHED</Badge>
                ) : (
                  <Badge className="bg-red-200 text-red-800">CANCELLED</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
