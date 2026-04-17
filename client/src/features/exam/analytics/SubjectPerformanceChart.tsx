import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import useIsMobile from "@/screen.detector";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#14B8A6",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="font-medium">{payload[0].payload.subject}</p>
        <p className="text-muted-foreground">
          Average:
          <span className="font-semibold text-primary ml-1">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const SubjectPerformanceChart = ({ data }: any) => {

  const isMobile = useIsMobile();

  const barSize = isMobile ? 18 : 32;
  const fontSize = isMobile ? 10 : 16;

  return (
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">
          Subject Performance
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Average marks per subject
        </CardDescription>
      </CardHeader>

      <CardContent className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={barSize}
            margin={{
              top: 10,
              right: isMobile ? 1 : 20,
              left: isMobile ? -40 : 0,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="subject"
              interval={0}   // force show all labels
              angle={-35}    // rotate labels to prevent overlap
              textAnchor="end"
              height={60}
              tick={{ fontSize: fontSize }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="average"
              radius={[8, 8, 0, 0]}
              animationDuration={900}
            >
              {data?.map((_: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SubjectPerformanceChart;