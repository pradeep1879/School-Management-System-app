// import { lazy, Suspense } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CalendarCheck2,
  ClipboardCheck,
  FileClock,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { DashboardUpcomingItem } from "../types/dashboard.types"; // DashboardActivityItem,
import WelcomeCard from "../components/dashboard/WelcomeCard";
import SectionWrapper from "../components/dashboard/SectionWrapper";
import StatCard from "../components/dashboard/StatCard";
import ChartCard from "../components/dashboard/ChartCard";
import EmptyState from "../components/dashboard/EmptyState";
// import StudentProfileWidget from "../components/dashboard/StudentProfileWidget";
import StudentDashboardSkeleton from "../components/dashboard/StudentDashboardSkeleton";
import { useStudentDashboard } from "../hooks/useStudentDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// const StudentDashboardAnalytics = lazy(
//   () => import("../components/dashboard/StudentDashboardAnalytics")
// );

const formatShortDate = (value: string) => format(new Date(value), "dd MMM");

const getUpcomingIcon = (type: DashboardUpcomingItem["type"]) => {
  return type === "exam" ? Trophy : FileClock;
};

// const getActivityBadgeVariant = (type: DashboardActivityItem["type"]) => {
//   return type === "result" ? "secondary" : "outline";
// };

const StudentDashboard = () => {
  const { summary,  isLoading } = useStudentDashboard(); // student

  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }

  const performanceOverview = summary?.trends.performanceOverview || [];
  const subjectPerformance = summary?.subjectPerformance || [];
  const topSubject = subjectPerformance[0];
  const weakSubjectCount = summary?.insights.weakSubjects.length || 0;

  const attendanceSparkline = summary?.attendance.heatmap
    .slice(-10)
    .map((entry) => ({ value: entry.value * 25 })) || [];
  const marksSparkline = performanceOverview.map((entry) => ({
    value: entry.studentMarks,
  }));
  const rankSparkline = (summary?.trends.rankTrend || [])
    .filter((entry) => entry.rank !== null)
    .map((entry) => ({
      value: entry.rank ? Math.max(0, 100 - entry.rank * 8) : 0,
    }));
  const subjectSparkline = subjectPerformance.slice(0, 6).map((entry) => ({
    value: entry.averageMarks,
  }));

  return (
    <div className="space-y-8 pb-6">
      <WelcomeCard summary={summary} />

      <SectionWrapper
        title="Quick Stats"
        description="A fast pulse on attendance, marks, class position, and assignment momentum."
      >
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-2">
          <StatCard
            title="Overall Attendance"
            value={`${summary?.attendance.percentage || 0}%`}
            helper={`${summary?.attendance.attendedCount || 0}/${summary?.attendance.totalCount || 0} sessions marked present or late`}
            icon={CalendarCheck2}
            trend={summary?.attendance.trend || 0}
            trendLabel="vs previous attendance window"
            chartData={attendanceSparkline}
            accentClassName="bg-emerald-500/10 text-emerald-300"
          />
          <StatCard
            title="Average Marks"
            value={`${summary?.avgMarks || 0}%`}
            helper={topSubject ? `Top subject: ${topSubject.subject}` : "Awaiting published results"}
            icon={Activity}
            trend={summary?.trends.marksTrend || 0}
            trendLabel="change from previous exam"
            chartData={marksSparkline}
            accentClassName="bg-violet-500/10 text-violet-300"
          />
          <StatCard
            title="Class Rank"
            value={summary?.rank ? `#${summary.rank}` : "--"}
            helper={summary?.rank ? "Current standing from latest published exam" : "Rank will appear after results are published"}
            icon={Trophy}
            trend={summary?.trends.rankTrendDelta || 0}
            trendLabel="positive means you moved up"
            chartData={rankSparkline}
            accentClassName="bg-amber-500/10 text-amber-300"
          />
          <StatCard
            title="Completed Assignments"
            value={`${summary?.quickStats.completedAssignments || 0}`}
            helper={`${summary?.quickStats.pendingHomework || 0} homework items still active`}
            icon={ClipboardCheck}
            trend={weakSubjectCount ? -weakSubjectCount : 0}
            trendLabel="subjects needing extra attention"
            chartData={subjectSparkline}
            accentClassName="bg-cyan-500/10 text-cyan-300"
          />
        </div>
      </SectionWrapper>

      {/* <SectionWrapper
        title="Performance Analytics"
        description="Modern visual summaries for marks, subject strength, class rank, and attendance consistency."
      >
        <Suspense fallback={<StudentDashboardSkeleton />}>
          <StudentDashboardAnalytics summary={summary} />
        </Suspense>
      </SectionWrapper> */}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionWrapper
          title="AI Insights"
          description="An AI-ready panel that turns your latest academic signals into focused next actions."
          className="h-full"
        >
          <Card className="overflow-hidden rounded-[28px] border border-primary/20 bg-transparent shadow-[0_25px_70px_-40px_rgba(168,85,247,0.9)]">
            <CardContent className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.95),rgba(59,7,100,0.85))] p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.25),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_26%)]" />
              <div className="relative space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      AI Study Copilot
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Personalized practice direction</h3>
                    <p className="max-w-xl text-sm text-slate-300">
                      Weak subjects are identified from your recent exam data, so your next quiz can target the areas that need the most lift.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-fuchsia-300">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Weak Subjects</p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {summary?.insights.weakSubjects.length
                        ? summary.insights.weakSubjects.join(", ")
                        : "No weak subjects identified yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Suggested Action</p>
                    <p className="mt-3 text-sm text-slate-200">
                      {summary?.insights.suggestedAction || "Keep a steady revision rhythm to maintain momentum."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Recommended AI Quiz</p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {summary?.insights.recommendedQuizTopic || "Mixed Practice"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="rounded-2xl bg-white text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-100"
                  >
                    <Link to="/student/ai-quiz">
                      <Sparkles className="h-4 w-4" />
                      Generate Smart Quiz
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-2xl border-white/15 bg-transparent text-white hover:scale-[1.02] hover:bg-white/10"
                  >
                    <Link to="/student/exams">
                      Review exam history
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </SectionWrapper>

        {/* <SectionWrapper
          title="Student Profile"
          description="Compact profile context with details available on demand."
          className="h-full"
        >
          <StudentProfileWidget student={student} />
        </SectionWrapper> */}

         <SectionWrapper
          title="Upcoming"
          description="Exams and homework deadlines that are coming up next."
          className="h-full"
        >
          <ChartCard title="Upcoming Timeline" description="Prioritize the next few due dates before they become urgent.">
            <div className="space-y-3">
              {summary?.upcoming.length ? (
                summary.upcoming.map((item) => {
                  const ItemIcon = getUpcomingIcon(item.type);

                  return (
                    <Link
                      key={item.id}
                      to={item.url}
                      className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                    >
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium">{item.title}</p>
                          <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-[0.18em]">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatShortDate(item.date)}</p>
                        <p className="text-xs text-muted-foreground">
                          in {formatDistanceToNowStrict(new Date(item.date))}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <EmptyState
                  icon={GraduationCap}
                  title="Nothing urgent ahead"
                  description="Your next exams and homework deadlines will appear here once they are scheduled."
                />
              )}
            </div>
          </ChartCard>
        </SectionWrapper>

      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
       

        {/* <SectionWrapper
          title="Recent Activity"
          description="Latest published results and announcements, all in one feed."
          className="h-full"
        >
          <ChartCard title="Recent Feed" description="Stay updated with what changed most recently.">
            <div className="space-y-3">
              {summary?.recentActivity.length ? (
                summary.recentActivity.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/40 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30"
                  >
                    <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/5 p-3 text-primary">
                      {item.type === "result" ? (
                        <Trophy className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{item.title}</p>
                        <Badge variant={getActivityBadgeVariant(item.type)} className="rounded-full text-[10px] uppercase tracking-[0.18em]">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {format(new Date(item.date), "dd MMM")}
                    </p>
                  </Link>
                ))
              ) : (
                <EmptyState
                  icon={Activity}
                  title="No recent updates"
                  description="As new results and announcements come in, they’ll show up here."
                />
              )}
            </div>
          </ChartCard>
        </SectionWrapper> */}

        {/* <SectionWrapper
          title="Study Pulse"
          description="A compact academic health summary for the week."
          className="h-full"
        >
          <ChartCard title="Focus Snapshot" description="Quick indicators to help you decide what to do next.">
            <div className="space-y-5">
              <div className="space-y-2 rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Attendance health</span>
                  <span className="font-medium">{summary?.attendance.percentage || 0}%</span>
                </div>
                <Progress value={summary?.attendance.percentage || 0} className="h-2" />
              </div>

              <div className="space-y-2 rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average marks</span>
                  <span className="font-medium">{summary?.avgMarks || 0}%</span>
                </div>
                <Progress value={summary?.avgMarks || 0} className="h-2" />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <p className="text-sm text-muted-foreground">Best performing subject</p>
                <p className="mt-2 text-lg font-semibold">
                  {topSubject ? topSubject.subject : "No published results yet"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {topSubject
                    ? `${topSubject.averageMarks}% average, class baseline ${topSubject.classAverage}%`
                    : "Your strongest subject will appear here once results are published."}
                </p>
              </div>

              <Button asChild variant="outline" className="w-full rounded-2xl">
                <Link to="/student/subjects">
                  Explore subjects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ChartCard>
        </SectionWrapper> */}
      </div>
    </div>
  );
};

export default StudentDashboard;
