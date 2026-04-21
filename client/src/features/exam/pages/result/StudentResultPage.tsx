import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  BookOpenText,
  GraduationCap,
  Medal,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useStudentDetailedResult } from "../../hooks/useResult";
import { useStudentProfile } from "@/features/student/hooks/useStudentProfile";
import { useStudent } from "@/features/student/hooks/useStudent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SubjectResult = {
  subjectName: string;
  totalMarks: number;
  passingMarks: number;
  obtainedMarks: number;
  status: "PASS" | "FAIL";
};

const resultBadgeClassName = {
  PASS: "border-emerald-400/20 bg-emerald-400/12 text-emerald-300",
  FAIL: "border-rose-400/20 bg-rose-400/12 text-rose-300",
} as const;

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2) || "ST";

const StudentResultPageSkeleton = () => {
  return (
    <div className="mx-auto max-w-5xl p-2 md:p-6">
      <Skeleton className="h-190 w-full rounded-[32px]" />
    </div>
  );
};

export default function StudentResultPage() {
  const { examId, studentId: paramStudentId } = useParams();
  const role = useAuthStore((state) => state.role);

  const { data: studentProfileData } = useStudentProfile();

  const studentId =
    role === "student" ? studentProfileData?.student?.id : paramStudentId;

  const { data: adminTeacherStudentData } = useStudent(studentId!);
  const { data, isLoading } = useStudentDetailedResult(examId!, studentId!);

  const student =
    role === "student"
      ? studentProfileData?.student
      : adminTeacherStudentData?.student;

  const subjectInsights = useMemo(() => {
    const subjects = (data?.subjects || []) as SubjectResult[];

    if (!subjects.length) {
      return {
        passCount: 0,
        strongest: null as SubjectResult | null,
      };
    }

    const strongest = [...subjects].sort((a, b) => {
      const aPercent = a.totalMarks ? a.obtainedMarks / a.totalMarks : 0;
      const bPercent = b.totalMarks ? b.obtainedMarks / b.totalMarks : 0;
      return bPercent - aPercent;
    })[0];

    return {
      passCount: subjects.filter((subject) => subject.status === "PASS").length,
      strongest,
    };
  }, [data?.subjects]);

  if (isLoading || !student) {
    return <StudentResultPageSkeleton />;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card className="rounded-[28px] border-border/60 bg-card/80">
          <CardContent className="p-8 text-center text-muted-foreground">
            No result found for this exam.
          </CardContent>
        </Card>
      </div>
    );
  }

  const resultStatus = data.finalStatus === "PASS" ? "PASS" : "FAIL";
  const totalSubjects = data.subjects.length;

  return (
    <div className="mx-auto max-w-5xl p-2 md:p-6">
      <Card className="overflow-hidden rounded-[32px] border-border/60 bg-card/90 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
        <CardContent className="p-0">
          <div className="relative overflow-hidden border-b border-border/60 bg-[linear-gradient(135deg,rgba(79,70,229,0.16),rgba(124,58,237,0.12),rgba(192,38,211,0.1))] px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_24%)]" />

            <div className="relative flex flex-col gap-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border border-white/10 shadow-lg">
                    <AvatarImage src={student?.imageUrl || undefined} />
                    <AvatarFallback className="bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white">
                      {getInitials(student?.studentName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                      Report Card
                    </div>
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {data.examTitle}
                      </h1>
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                        Official examination report for {student?.studentName}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-border/60 bg-background/60 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Final Result
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Badge
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${resultBadgeClassName[resultStatus]}`}
                    >
                      {resultStatus}
                    </Badge>
                    <span className="text-3xl font-semibold text-foreground">
                      {data.grade}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Student", value: student?.studentName || "--" },
                  {
                    label: "Class",
                    value: `${student?.class?.slug || "--"} • ${student?.class?.section || "--"}`,
                  },
                  { label: "Roll Number", value: student?.rollNumber || "--" },
                  { label: "Session", value: student?.class?.session || "--" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-4xl border border-border/60 bg-background/45 px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Examination Summary
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Consolidated performance details for this exam.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 xl:grid-cols-5">
                {[
                  {
                    label: "Total Marks",
                    value: `${data.totalObtained}/${data.totalMarks}`,
                    icon: BookOpenText,
                  },
                  {
                    label: "Percentage",
                    value: `${data.percentage}%`,
                    icon: ShieldCheck,
                  },
                  {
                    label: "Grade",
                    value: data.grade,
                    icon: GraduationCap,
                  },
                  {
                    label: "Rank",
                    value: data.rank ? `#${data.rank}` : "--",
                    icon: Medal,
                  },
                  {
                    label: "Subjects Cleared",
                    value: `${subjectInsights.passCount}/${totalSubjects}`,
                    icon: resultStatus === "PASS" ? ShieldCheck : ShieldX,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.label === "Total Marks" ? "col-span-2 xl:col-span-1" : ""} rounded-[22px] border border-border/60 bg-background/40 px-4 py-5`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <item.icon className="h-4 w-4 text-primary/80" />
                    </div>
                    <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] border border-border/60 bg-background/35 p-5">
                <h3 className="text-lg font-semibold text-foreground">
                  Candidate Details
                </h3>
                <div className="mt-5 grid gap-4 grid-cols-2 sm:grid-cols-2">
                  {[
                    {
                      label: "Student Name",
                      value: student?.studentName || "--",
                    },
                    { label: "Username", value: student?.userName || "--" },
                    {
                      label: "Roll Number",
                      value: student?.rollNumber || "--",
                    },
                    {
                      label: "Class",
                      value: `${student?.class?.slug || "--"} - ${student?.class?.section || "--"}`,
                    },
                    {
                      label: "Session",
                      value: student?.class?.session || "--",
                    },
                    { label: "Exam ID", value: examId || "--" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="space-y-2 border-b border-border/50 pb-3 last:border-b-0"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="break-all text-sm font-medium text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-border/60 bg-background/35 p-5">
                <h3 className="text-lg font-semibold text-foreground">
                  Teacher Remarks
                </h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-4xl border border-border/60 bg-card/50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Performance Highlight
                    </p>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      {subjectInsights.strongest
                        ? `${student?.studentName} performed best in ${subjectInsights.strongest.subjectName}, scoring ${subjectInsights.strongest.obtainedMarks} out of ${subjectInsights.strongest.totalMarks}.`
                        : "Performance insights will appear once subject data is available."}
                    </p>
                  </div>

                  <div className="rounded-4xl border border-dashed border-border/60 bg-card/30 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Result Note
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      This report card reflects marks from the published exam
                      only and is intended for academic review.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-border/60 bg-background/30 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Subject Wise Marks Statement
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Detailed ledger of marks obtained in each subject.
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="rounded-full border-border/60 px-3 py-1 text-xs uppercase tracking-[0.18em]"
                >
                  {totalSubjects} Subjects
                </Badge>
              </div>

              {/*  MOBILE VIEW (Cards) */}
              <div className="mt-6 space-y-4 md:hidden">
                {data.subjects.map((subject: SubjectResult) => {
                  const subjectPercentage = subject.totalMarks
                    ? (
                        (subject.obtainedMarks / subject.totalMarks) *
                        100
                      ).toFixed(2)
                    : "0.00";

                  return (
                    <div
                      key={subject.subjectName}
                      className="rounded-2xl border border-border/60 p-4 bg-background/40"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {subject.subjectName}
                        </h3>
                        <Badge
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${resultBadgeClassName[subject.status]}`}
                        >
                          {subject.status}
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium">{subject.totalMarks}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Passing</p>
                          <p className="font-medium">{subject.passingMarks}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Obtained</p>
                          <p className="font-medium">{subject.obtainedMarks}</p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Percentage</p>
                          <p className="font-medium">{subjectPercentage}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/*  DESKTOP TABLE */}
              <div className="mt-6 hidden md:block overflow-x-auto custom-div-scroll rounded-[22px] border border-border/60">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-muted/20">
                    <tr className="text-left">
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Subject
                      </th>
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Total
                      </th>
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Passing
                      </th>
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Obtained
                      </th>
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Percentage
                      </th>
                      <th className="px-4 py-4 font-semibold text-foreground">
                        Result
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.subjects.map(
                      (subject: SubjectResult, index: number) => {
                        const subjectPercentage = subject.totalMarks
                          ? (
                              (subject.obtainedMarks / subject.totalMarks) *
                              100
                            ).toFixed(2)
                          : "0.00";

                        return (
                          <tr
                            key={subject.subjectName}
                            className={
                              index !== data.subjects.length - 1
                                ? "border-b border-border/60"
                                : ""
                            }
                          >
                            <td className="px-4 py-4 font-medium text-foreground">
                              {subject.subjectName}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">
                              {subject.totalMarks}
                            </td>
                            <td className="px-4 py-4 text-muted-foreground">
                              {subject.passingMarks}
                            </td>
                            <td className="px-4 py-4 text-foreground">
                              {subject.obtainedMarks}
                            </td>
                            <td className="px-4 py-4 text-foreground">
                              {subjectPercentage}%
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${resultBadgeClassName[subject.status]}`}
                              >
                                {subject.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
              This is a computer generated report card for the selected
              published examination.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
