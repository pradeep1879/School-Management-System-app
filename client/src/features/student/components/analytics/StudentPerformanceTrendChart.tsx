import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useStudentPerformanceTrend } from "../../hooks/analyticsHooks/useStudentPerformanceTrend";
import useIsMobile from "@/screen.detector";

interface Props {
  studentId?: string;
}

const StudentPerformanceTrendChart = ({ studentId }: Props) => {
  const { data, isLoading } = useStudentPerformanceTrend(studentId!);
  const isMobile = useIsMobile();

  const barSize = isMobile ? 12 : 32;
  const fontSize = isMobile ? 10 : 16;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Performance Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.performance?.map((exam: any) => ({
      exam: exam.examTitle,
      percentage: exam.percentage,
    })) || [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-md p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>

          <p className="text-indigo-500">Percentage: {payload[0]?.value}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="shadow-sm border-muted/40">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Exam Performance Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            barSize={barSize}
            margin={{
              top: 10,
              right: isMobile ? 1 : 20,
              left: isMobile ? -40 : 0,
              bottom: 0,
            }}
            barGap={4}
            data={chartData}
          >
            {/* Gradient */}
            <defs>
              <linearGradient id="trendLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.15}
            />

            <XAxis
              dataKey="exam"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: fontSize }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: fontSize }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="percentage"
              stroke="url(#trendLine)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceTrendChart;
