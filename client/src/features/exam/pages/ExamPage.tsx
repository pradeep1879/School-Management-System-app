import { Plus, Search, Calendar, BookOpen } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { useExams } from "../hooks/useExam";
import AddExamDialog from "../forms/CreateExamForm";
import ExamStatusActions from "../components/ExamStatusActions";

import { useCurrentClass } from "@/features/class/hooks/useCurrentClass";
import { Skeleton } from "@/components/ui/skeleton";

type ExamStatus =
  | "SCHEDULED"
  | "ONGOING"
  | "EVALUATION"
  | "PUBLISHED"
  | "CANCELLED";

type Exam = {
  id: string;
  title: string;
  examType: string;
  startDate: string;
  subjects: any[];
  status: ExamStatus;
};

export default function ExamPage() {
  const role = useAuthStore((state) => state.role);

  const { classId, isLoading: classLoading } = useCurrentClass();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { data, isLoading } = useExams(classId);
  const exams: Exam[] = data?.exams || [];

  const filteredExams = exams.filter((exam: any) =>
    exam.title.toLowerCase().includes(search.toLowerCase()),
  );

  const statusColor: Record<ExamStatus, string> = {
    SCHEDULED: "bg-gray-100 text-gray-700 border border-gray-200",
    ONGOING: "bg-green-100 text-green-700 border border-green-200",
    EVALUATION: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    PUBLISHED: "bg-blue-100 text-blue-700 border border-blue-200",
    CANCELLED: "bg-red-100 text-red-700 border border-red-200",
  };

 if (classLoading) {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

  if (!classId) {
    return <div className="text-center py-10 text-red-500">No class found</div>;
  }

  

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Class Exams</h2>
          <p className="text-sm text-muted-foreground">
            Manage exams and assessments for this class
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exam..."
              className="pl-9"
            />
          </div>
          {/* role === "admin" ||  */}
          {role === "teacher" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Exam
                </Button>
              </DialogTrigger>

              <AddExamDialog classId={classId} setOpen={setOpen} />
            </Dialog>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/50 rounded-xl p-6 bg-card space-y-5"
            >
              {/* Title + Type */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>

              {/* Date */}
              <Skeleton className="h-4 w-32" />

              {/* Subjects List */}
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div
                    key={j}
                    className="border rounded-lg p-3 bg-muted/30 space-y-2"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>

              {/* Status + Actions */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-24 rounded-full" />

                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GRID */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExams.map((exam: any) => (
            <div
              key={exam.id}
              className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {exam.examType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Calendar size={14} />
                {new Date(exam.startDate).toLocaleDateString()}
              </div>

              <div className="mt-4 space-y-3">
                {exam.subjects?.map((sub: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-muted/30"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen size={14} />
                        {sub.subject?.name}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {sub.totalMarks} Marks
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      Passing: {sub.passingMarks}
                    </div>

                    {sub.syllabus && (
                      <div className="mt-2 text-xs bg-background border rounded-md p-2 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Syllabus:
                        </span>{" "}
                        {sub.syllabus}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                <Badge
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    statusColor[exam.status as ExamStatus]
                  }`}
                >
                  {exam.status}
                </Badge>

                {role === "teacher" && (
                  <div className="grid grid-cols-2 gap-2">
                    <ExamStatusActions
                      examId={exam.id}
                      status={exam.status}
                      role={role}
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/teacher/exam/${exam.id}`)}
                    >
                      Manage
                    </Button>
                  </div>
                )}
              </div>
              {exam?.status === "PUBLISHED" && (
                <Button
                  size="sm"
                  className="col-span-2 mt-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white"
                  onClick={() => navigate(`/${role}/exam/${exam.id}/results`)}
                >
                  View Results
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
