import { Link } from "react-router-dom";
import { BarChart3, BookMarked, CalendarClock, Sparkles, Trophy } from "lucide-react";

import type { StudentDashboardSummary } from "../../types/dashboard.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeCardProps {
  summary?: StudentDashboardSummary;
}

const miniStatConfig = [
  {
    key: "attendance",
    label: "Attendance",
    formatter: (summary: StudentDashboardSummary) => `${summary.quickStats.attendance}%`,
    icon: CalendarClock,
  },
  {
    key: "upcomingExams",
    label: "Upcoming Exams",
    formatter: (summary: StudentDashboardSummary) => `${summary.quickStats.upcomingExams}`,
    icon: Trophy,
  },
  {
    key: "pendingHomework",
    label: "Pending Homework",
    formatter: (summary: StudentDashboardSummary) => `${summary.quickStats.pendingHomework}`,
    icon: BookMarked,
  },
  {
    key: "latestRank",
    label: "Latest Rank",
    formatter: (summary: StudentDashboardSummary) =>
      summary.quickStats.latestRank ? `#${summary.quickStats.latestRank}` : "--",
    icon: BarChart3,
  },
] as const;

const WelcomeCard = ({ summary }: WelcomeCardProps) => {
  const student = summary?.student;
  const initials = student?.studentName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="overflow-hidden rounded-[32px] border-border/50 bg-transparent shadow-[0_35px_100px_-45px_rgba(168,85,247,0.9)]">
      <CardContent className="relative overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-0 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.38),transparent_28%)]" />
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border border-white/20 shadow-xl sm:h-20 sm:w-20">
                <AvatarImage src={student?.imageUrl || undefined} />
                <AvatarFallback className="bg-white/15 text-lg font-semibold text-white">
                  {initials || "ST"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.22em] text-white/80 uppercase">
                  Today&apos;s Summary
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Welcome back, {student?.studentName || "Student"}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                    You&apos;re in {student?.class.slug || "--"} section {student?.class.section || "--"}.
                    Keep an eye on your upcoming work and stay ahead of your next exam cycle.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-white/80">
                  <span>Roll No: {student?.rollNumber || "--"}</span>
                  <span>Session: {student?.class.session || "--"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-slate-950/80 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-950"
              >
                <Link to="/student/ai-quiz">
                  <Sparkles className="h-4 w-4" />
                  Take AI Quiz
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-2xl border border-white/15 bg-white/12 text-white backdrop-blur hover:scale-[1.02] hover:bg-white/20"
              >
                <Link to="/student/exams">
                  <BarChart3 className="h-4 w-4" />
                  View Performance
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
            {summary
              ? miniStatConfig.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[24px] border border-white/12 bg-slate-950/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/75">{item.label}</p>
                      <item.icon className="h-4 w-4 text-white/70" />
                    </div>
                    <p className="mt-4 text-2xl font-semibold">{item.formatter(summary)}</p>
                  </div>
                ))
              : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
