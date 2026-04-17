import { Label, Pie, PieChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartData = [
  { browser: "Present", visitors: 28, fill: "var(--color-green-600)" },
  { browser: "Absent", visitors: 4, fill: "var(--color-red-600)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Website: {
    label: "Total",
    color: "var(--color-blue-500)",
  },
  Marketplace: {
    label: "Present",
    color: "var(--color-sky-400)",
  },
  Affiliate: {
    label: "Absent",
    color: "var(--color-blue-500)",
  },
} satisfies ChartConfig;

export default function AttendenceReportChart() {
  const CustomerSegmentation = [
    {
      id: 1,
      customer: "Total ",
      tagColor: "muted-foreground",
      borderColor: "bg-blue-500",
      badgeColor: "bg-teal-400/10",
      earning: 32,
    },
    {
      id: 2,
      customer: "Present",
      tagColor: "muted-foreground",
      borderColor: "bg-green-600",
      badgeColor: "bg-teal-400/10",
      earning: 28,
    },
    {
      id: 3,
      customer: "Absent",
      tagColor: "muted-foreground",
      borderColor: "bg-red-600",
      badgeColor: "bg-teal-400/10",
      earning: 4,
    },
  ];

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>
          <h4 className="text-lg font-semibold">Staff Attendence Report</h4>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={65}
              strokeWidth={50}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15}
                          className="fill-foreground text-xl font-medium"
                        >
                          32
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-3">
          {CustomerSegmentation.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(item.borderColor, "w-1 h-4 rounded-full")}
                ></div>
                <h6 className={cn("text-sm font-medium leading-tight")}>
                  {item.customer}
                </h6>
              </div>
              <div className="flex items-center gap-1">
                <h6 className="text-sm font-medium">{item.earning}</h6>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
