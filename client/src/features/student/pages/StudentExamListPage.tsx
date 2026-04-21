import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentClass } from "@/features/class/hooks/useCurrentClass";
import { useExams } from "@/features/exam/hooks/useExam";

type ExamSubject = {
  id: string;
  subjectId: string;
  syllabus?: string | null;
  totalMarks: number;
  passingMarks: number;
  subject: {
    name: string;
  };
};

type ExamItem = {
  id: string;
  title: string;
  examType: string;
  startDate: string;
  status: "SCHEDULED" | "ONGOING" | "EVALUATION" | "PUBLISHED" | "CANCELLED";
  subjects: ExamSubject[];
};

const statusClassNames: Record<ExamItem["status"], string> = {
  PUBLISHED: "border-blue-400/20 bg-blue-400/12 text-blue-300",
  ONGOING: "border-amber-400/20 bg-amber-400/12 text-amber-300",
  SCHEDULED: "border-cyan-400/20 bg-cyan-400/12 text-cyan-300",
  EVALUATION: "border-violet-400/20 bg-violet-400/12 text-violet-300",
  CANCELLED: "border-rose-400/20 bg-rose-400/12 text-rose-300",
};

const StudentExamsSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 w-full rounded-[28px]" />
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-90 w-full rounded-[28px]" />
        ))}
      </div>
    </div>
  );
};

export default function StudentExamListPage() {
  const navigate = useNavigate();
  const { classId, isLoading: classLoading } = useCurrentClass();
  const { data, isLoading } = useExams(classId);

  if (classLoading || isLoading) {
    return <StudentExamsSkeleton />;
  }

  if (!classId) {
    return (
      <div className="py-10 text-center text-red-500">Class not found</div>
    );
  }

  const exams: ExamItem[] =
    data?.exams
      ?.filter((exam: ExamItem) =>
        ["PUBLISHED", "ONGOING", "SCHEDULED", "EVALUATION", "CANCELLED"].includes(
          exam.status
        )
      )
      ?.sort(
        (a: ExamItem, b: ExamItem) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ) || [];

  const summary = {
    total: exams.length,
    published: exams.filter((exam) => exam.status === "PUBLISHED").length,
    active: exams.filter((exam) => ["ONGOING", "SCHEDULED", "EVALUATION"].includes(exam.status)).length,
  };

  if (exams.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No exams available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[30px] border-border/60 bg-transparent shadow-[0_25px_90px_-55px_rgba(139,92,246,0.75)]">
        <CardContent className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(79,70,229,0.16),rgba(124,58,237,0.12),rgba(192,38,211,0.1))] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_24%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                Student Exams
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  My Exams
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Track upcoming, ongoing, and published exams in one place. Published exams open your report card, and every card now includes the covered syllabus.
                </p>
              </div>
            </div>

            <div className="grid gap-5 grid-cols-3">
              {[
                { label: "Total Exams", value: summary.total, icon: ClipboardList },
                { label: "Published", value: summary.published, icon: Sparkles },
                { label: "Active", value: summary.active, icon: CalendarDays },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-35 rounded-[22px] border border-border/60 bg-background/50 px-4 py-4 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] md:text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <item.icon className="h-4 w-4 text-primary/80" />
                  </div>
                  <p className="mt-3 text-xl  md:text-2xl font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam) => {
          const canOpenResult = exam.status === "PUBLISHED";
          const syllabusSubjects = exam.subjects.filter((subject) =>
            subject.syllabus?.trim()
          );

          return (
            <ExamCard
              key={exam.id}
              exam={exam}
              canOpenResult={canOpenResult}
              syllabusSubjects={syllabusSubjects}
              onOpenResult={() => navigate(`/student/exam/${exam.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

function ExamCard({
  exam,
  canOpenResult,
  syllabusSubjects,
  onOpenResult,
}: {
  exam: ExamItem;
  canOpenResult: boolean;
  syllabusSubjects: ExamSubject[];
  onOpenResult: () => void;
}) {
  const [showAllSyllabus, setShowAllSyllabus] = useState(false);

  const visibleSyllabus = showAllSyllabus
    ? syllabusSubjects
    : syllabusSubjects.slice(0, 2);

  const remainingCount = Math.max(0, syllabusSubjects.length - 2);
  const isCancelled = exam.status === "CANCELLED";
  const actionLabel = canOpenResult
    ? "Open your published result"
    : isCancelled
      ? "This exam was cancelled"
      : "Result will unlock after publication";
  const buttonLabel = canOpenResult
    ? "View Result"
    : isCancelled
      ? "Cancelled"
      : "Await Result";

  return (
    <Card
      className={`rounded-[28px] border-border/60 bg-card/80 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.95)] transition-all duration-300 ${
        canOpenResult
          ? "cursor-pointer hover:scale-[1.02] hover:border-primary/30"
          : "hover:border-border/70"
      }`}
      onClick={() => {
        if (canOpenResult) {
          onOpenResult();
        }
      }}
    >
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
              {exam.examType}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">
              {exam.title}
            </h3>
          </div>
          <Badge
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClassNames[exam.status]}`}
          >
            {exam.status}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background/35 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Exam Date
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {format(new Date(exam.startDate), "dd MMM yyyy")}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/35 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              Subjects
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {exam.subjects?.length || 0} subjects
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-[22px] border border-border/60 bg-background/30 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Syllabus Coverage
          </div>

          {visibleSyllabus.length ? (
            <div className="space-y-3">
              {visibleSyllabus.map((subject) => (
                <div key={subject.id} className="rounded-2xl border border-border/50 bg-card/50 p-3">
                  <p className="text-sm font-medium text-foreground">
                    {subject.subject.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {subject.syllabus}
                  </p>
                </div>
              ))}

              {remainingCount > 0 && !showAllSyllabus ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowAllSyllabus(true);
                  }}
                >
                  +{remainingCount} more subjects
                </Button>
              ) : null}

              {showAllSyllabus && syllabusSubjects.length > 2 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-muted-foreground"
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowAllSyllabus(false);
                  }}
                >
                  Show less
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
              Syllabus has not been added for this exam yet.
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between rounded-2xl border border-border/60 bg-background/30 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Action
            </p>
            <p className="mt-1 text-sm text-foreground">{actionLabel}</p>
          </div>

          <Button
            type="button"
            variant={canOpenResult ? "default" : "outline"}
            className="rounded-2xl"
            disabled={!canOpenResult}
            onClick={(event) => {
              event.stopPropagation();
              if (canOpenResult) {
                onOpenResult();
              }
            }}
          >
            {buttonLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
