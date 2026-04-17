import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";


const COLORS = [
  "#22c55e", // A
  "#3b82f6", // B
  "#facc15", // C
  "#fb923c", // D
  "#ef4444", // F
  "#6b7280", // Other
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];

   

    return (
      <div className="bg-white border shadow-md rounded-lg px-3 py-2 text-sm">
        <p className="font-medium">{item.name}</p>
        <p className="text-muted-foreground">
          Students:{" "}
          <span className="font-semibold text-primary">
            {item.value}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

const GradeDistributionChart = ({ data }: any) => {
  const chartData = data
    .filter((g: any) => g.count > 0)
    .map((g: any) => ({
      name: g.grade,
      value: g.count,
    }));

  const total = chartData.reduce((acc: number, item: any) => acc + item.value, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>
          Performance breakdown by grades
        </CardDescription>
      </CardHeader>

      <CardContent className="h-80 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              cornerRadius={6}
            >
              {chartData.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GradeDistributionChart;