import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardAnalytics } from "../hooks/useAdminDashboard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Cell, Label, Pie, PieChart } from "recharts";

const attendancePalette = {
  present: "#22c55e",
  absent: "#f43f5e",
  leave: "#f59e0b",
  holiday: "#38bdf8",
};

const chartConfig = {
  present: { label: "Present", color: attendancePalette.present },
  absent: { label: "Absent", color: attendancePalette.absent },
  leave: { label: "Leave", color: attendancePalette.leave },
  holiday: { label: "Holiday", color: attendancePalette.holiday },
} satisfies ChartConfig;

const buildSegments = (stats: {
  PRESENT?: number;
  ABSENT?: number;
  LEAVE?: number;
  HOLIDAY?: number;
}) =>
  [
    { key: "present", label: "Present", value: stats.PRESENT ?? 0, fill: attendancePalette.present },
    { key: "absent", label: "Absent", value: stats.ABSENT ?? 0, fill: attendancePalette.absent },
    { key: "leave", label: "Leave", value: stats.LEAVE ?? 0, fill: attendancePalette.leave },
    { key: "holiday", label: "Holiday", value: stats.HOLIDAY ?? 0, fill: attendancePalette.holiday },
  ].filter((item) => item.value > 0);

const AttendanceDonut = ({
  title,
  segments,
}: {
  title: string;
  segments: ReturnType<typeof buildSegments>;
}) => {
  const total = segments.reduce((sum, item) => sum + item.value, 0);
  const present = segments.find((item) => item.key === "present")?.value ?? 0;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            {total} records captured today
          </p>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
          {attendanceRate}% present
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
        <ChartContainer config={chartConfig} className="mx-auto h-40 w-40">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            <Pie data={segments} dataKey="value" nameKey="label" innerRadius={42} outerRadius={62} strokeWidth={4}>
              {segments.map((item) => (
                <Cell key={item.key} fill={item.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 6} className="fill-muted-foreground text-[10px] uppercase tracking-[0.24em]">
                        Today
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-foreground text-2xl font-semibold">
                        {total}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="space-y-3">
          {[
            { label: "Present", value: present, color: attendancePalette.present },
            { label: "Absent", value: segments.find((item) => item.key === "absent")?.value ?? 0, color: attendancePalette.absent },
            { label: "Leave", value: segments.find((item) => item.key === "leave")?.value ?? 0, color: attendancePalette.leave },
            { label: "Holiday", value: segments.find((item) => item.key === "holiday")?.value ?? 0, color: attendancePalette.holiday },
          ].map((item) => {
            const share = total ? (item.value / total) * 100 : 0;

            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </div>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary/70">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${share}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function AttendenceReportChart() {
  const { data, isLoading } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <Card className="h-full py-0">
        <CardHeader className="pb-4">
          <CardTitle>Attendance Mix</CardTitle>
          <CardDescription>Live distribution across staff and students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  const studentSegments = buildSegments(data?.todayAttendance?.students ?? {});
  const teacherSegments = buildSegments(data?.todayAttendance?.teachers ?? {});

  return (
    <Card className="h-full py-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Attendance Mix</CardTitle>
        <CardDescription>
          Real-time breakdown of today&apos;s attendance across students and staff.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pb-6">
        <AttendanceDonut title="Students" segments={studentSegments} />
        <AttendanceDonut title="Teachers" segments={teacherSegments} />
      </CardContent>
    </Card>
  );
}
