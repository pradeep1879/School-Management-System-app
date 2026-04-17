import { useParams, useNavigate } from "react-router-dom";
import { useExams } from "../hooks/useExam";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";

export default function ExamDetailPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  //  Get teacher assigned class
  const { data: teacherClass } = useTeacherClass(true);
  const classId = teacherClass?.classDetail?.id;

  const { data, isLoading } = useExams(classId);

  if (!classId || isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading exam...
      </div>
    );
  }

  const exam = data?.exams?.find((e: any) => e.id === examId);

  if (!exam) {
    return <p className="text-center py-10">Exam not found</p>;
  }

  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="border rounded-xl p-6 bg-card">
        <h2 className="text-xl font-semibold">{exam.title}</h2>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <Calendar size={14} />
          {new Date(exam.startDate).toLocaleDateString()}
        </div>

        <div className="mt-4">
          <Badge>{exam.status}</Badge>
        </div>
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Subjects</h3>

        {exam.subjects.map((subjectItem: any) => (
          <div
            key={subjectItem.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {subjectItem.subject.name}
              </p>

              <p className="text-sm text-muted-foreground">
                Total: {subjectItem.totalMarks} | Pass:{" "}
                {subjectItem.passingMarks}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Syllabus: {subjectItem.syllabus}
              </p>
            </div>

            <Button
              onClick={() =>
                navigate(
                  `/teacher/exam/${exam.id}/marks?subjectId=${subjectItem.subjectId}`
                )
              }
              disabled={exam.status === "PUBLISHED"}
            >
              Enter Marks
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}