import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardAnalytics } from "../../hooks/useAdminDashboard";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  students: { label: "Students", color: "#7c3aed" },
  teachers: { label: "Teachers", color: "#10b981" },
} satisfies ChartConfig;

const getBarColors = (size: number, base: string, soft: string) =>
  Array.from({ length: size }, (_, index) => (index === size - 1 ? base : soft));

const DailyAttendanceChart = () => {
  const { data, isLoading } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader>
          <CardTitle>Attendance Trend</CardTitle>
          <CardDescription>Weekly live movement across students and teachers</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.charts?.weeklyAttendance?.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      }),
      students: item.studentsPresent,
      teachers: item.teachersPresent,
    })) ?? [];

  const studentColors = getBarColors(chartData.length, "#8b5cf6", "#5b4be033");
  const teacherColors = getBarColors(chartData.length, "#10b981", "#10b98133");

  return (
    <Card className="">
      <CardHeader className="gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-lg">Attendance Trend</CardTitle>
          <CardDescription>
            Student and teacher presence across the latest weekly reporting window.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-violet-200">
            Students
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-emerald-200">
            Teachers
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full sm:h-[340px]">
          <BarChart data={chartData} barGap={10} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              interval={0}
              minTickGap={20}
              tick={{ fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="students" radius={[10, 10, 0, 0]} maxBarSize={26}>
              {chartData.map((_, index) => (
                <Cell key={`student-${index}`} fill={studentColors[index]} />
              ))}
            </Bar>
            <Bar dataKey="teachers" radius={[10, 10, 0, 0]} maxBarSize={26}>
              {chartData.map((_, index) => (
                <Cell key={`teacher-${index}`} fill={teacherColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceChart;
