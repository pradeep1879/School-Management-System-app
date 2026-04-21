import { memo } from "react";
import { format } from "date-fns";
import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import type { StudentDashboardSummary } from "../../types/dashboard.types";
import ChartCard from "./ChartCard";
import EmptyState from "./EmptyState";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface StudentDashboardAnalyticsProps {
  summary?: StudentDashboardSummary;
}

const axisFormatter = (value: string) => format(new Date(value), "MMM d");

const attendanceCellClassName = (value: number) => {
  if (value >= 4) return "bg-emerald-400/90";
  if (value === 3) return "bg-cyan-400/90";
  if (value === 2) return "bg-amber-400/90";
  if (value === 1) return "bg-rose-500/80";
  return "bg-muted/35";
};

const StudentDashboardAnalytics = ({ summary }: StudentDashboardAnalyticsProps) => {
  if (!summary) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <EmptyState
          icon={BarChart3}
          title="Analytics will appear here"
          description="Once exam and attendance data is available, this section will show performance trends and class comparisons."
        />
      </div>
    );
  }

  const performanceOverview = summary.trends.performanceOverview;
  const subjectPerformance = summary.subjectPerformance;
  const rankTrend = summary.trends.rankTrend.filter((item) => item.rank !== null);
  const attendanceHeatmap = summary.attendance.heatmap;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Performance Overview"
        description="Track your marks against the class average across published exams."
      >
        {performanceOverview.length ? (
          <ChartContainer
            config={{
              studentMarks: { label: "Your Marks", color: "#8b5cf6" },
              classAverage: { label: "Class Average", color: "#22d3ee" },
            }}
            className="h-[320px] w-full"
          >
            <LineChart data={performanceOverview} margin={{ top: 16, right: 12, left: -10, bottom: 4 }}>
              <defs>
                <linearGradient id="studentTrendGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={axisFormatter}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.examTitle || ""}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="studentMarks"
                stroke="url(#studentTrendGradient)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="classAverage"
                stroke="var(--color-classAverage)"
                strokeWidth={2}
                strokeDasharray="6 6"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No published results yet"
            description="Performance charts will unlock once at least one exam is published for your class."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Subject Performance"
        description="Compare your average score with the class baseline by subject."
      >
        {subjectPerformance.length ? (
          <ChartContainer
            config={{
              averageMarks: { label: "Your Average", color: "#8b5cf6" },
              classAverage: { label: "Class Average", color: "#06b6d4" },
            }}
            className="h-[320px] w-full"
          >
            <BarChart data={subjectPerformance} margin={{ top: 16, right: 10, left: -12, bottom: 24 }} barGap={12}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="subject"
                axisLine={false}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                height={52}
                interval={0}
              />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="averageMarks" radius={[10, 10, 0, 0]}>
                {subjectPerformance.map((subject) => (
                  <Cell
                    key={subject.subject}
                    fill={
                      subject.averageMarks >= subject.classAverage
                        ? "#8b5cf6"
                        : "#f43f5e"
                    }
                  />
                ))}
              </Bar>
              <Bar dataKey="classAverage" fill="var(--color-classAverage)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Subject analytics unavailable"
            description="Once there are exam results across subjects, this chart will highlight your strongest and weakest subjects."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Rank Trend"
        description="See how your class position has changed over recent exams."
      >
        {rankTrend.length ? (
          <ChartContainer
            config={{
              rank: { label: "Rank", color: "#22c55e" },
            }}
            className="h-[320px] w-full"
          >
            <AreaChart data={rankTrend} margin={{ top: 12, right: 12, left: -8, bottom: 4 }}>
              <defs>
                <linearGradient id="rankAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={axisFormatter}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis reversed axisLine={false} tickLine={false} allowDecimals={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-muted-foreground">Rank</span>
                        <span className="font-medium">#{value}</span>
                      </div>
                    )}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.examTitle || ""}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="rank"
                stroke="var(--color-rank)"
                strokeWidth={2.5}
                fill="url(#rankAreaGradient)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Ranking starts after the first result"
            description="Rank history will show up once the class has at least one published exam with results."
          />
        )}
      </ChartCard>

      <ChartCard
        title="Attendance Heatmap"
        description="A 90-day snapshot of your attendance rhythm, inspired by contribution grids."
      >
        {attendanceHeatmap.length ? (
          <div className="space-y-4">
            <div className="grid grid-cols-9 gap-2 sm:grid-cols-10 lg:grid-cols-12">
              {attendanceHeatmap.map((cell) => (
                <div key={cell.date} className="group relative">
                  <div
                    className={`aspect-square rounded-md border border-white/5 transition-transform duration-200 group-hover:scale-110 ${attendanceCellClassName(
                      cell.value
                    )}`}
                  />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg border border-border/70 bg-background/95 px-2 py-1 text-[11px] text-foreground shadow-lg group-hover:block">
                    {format(new Date(cell.date), "dd MMM")} • {cell.status.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Less</span>
              <span className="h-3 w-3 rounded-sm bg-muted/35" />
              <span className="h-3 w-3 rounded-sm bg-rose-500/80" />
              <span className="h-3 w-3 rounded-sm bg-amber-400/90" />
              <span className="h-3 w-3 rounded-sm bg-cyan-400/90" />
              <span className="h-3 w-3 rounded-sm bg-emerald-400/90" />
              <span>More</span>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Attendance data is still building"
            description="Once attendance is marked regularly, you’ll see your monthly pattern here."
          />
        )}
      </ChartCard>
    </div>
  );
};

export default memo(StudentDashboardAnalytics);
