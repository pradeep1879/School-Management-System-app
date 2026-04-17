import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", salaries: 250, maintenance: 60, utilities: 40, misc: 30 },
  { month: "Feb", salaries: 260, maintenance: 55, utilities: 45, misc: 25 },
  
  { month: "Sep", salaries: 275, maintenance: 66, utilities: 47, misc: 30 },
  { month: "Oct", salaries: 295, maintenance: 78, utilities: 58, misc: 42 },
  { month: "Nov", salaries: 310, maintenance: 85, utilities: 65, misc: 50 },
  { month: "Dec", salaries: 320, maintenance: 90, utilities: 70, misc: 55 },
]

const chartConfig = {
  salaries: {
    label: "Salaries",
    color: "hsl(var(--chart-1))",
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-2))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-3))",
  },
  misc: {
    label: "Miscellaneous",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function MonthlyExpenseChart() {
  const categories = [
    { title: "Salaries", color: "bg-[hsl(var(--chart-1))]" },
    { title: "Maintenance", color: "bg-[hsl(var(--chart-2))]" },
    { title: "Utilities", color: "bg-[hsl(var(--chart-3))]" },
    { title: "Misc", color: "bg-[hsl(var(--chart-4))]" },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="flex sm:flex-row flex-col justify-between sm:items-center items-start gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-medium">
            Monthly School Expense Overview
          </CardTitle>

          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-semibold text-card-foreground">
              ₹ 3.86M
            </h3>

            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 shadow-none">
              +8%
            </Badge>

            <span className="text-xs text-muted-foreground">
              than last year
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {categories.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={cn("w-3 h-3 rounded-full", item.color)} />
              <p className="text-sm text-muted-foreground">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="opacity-40"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `₹${value}K`}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="salaries"
              stackId="a"
              fill="var(--chart-1)"
              radius={[0, 0, 0, 0]}
            />

            <Bar
              dataKey="maintenance"
              stackId="a"
              fill="var(--chart-2)"
            />

            <Bar
              dataKey="utilities"
              stackId="a"
              fill="var(--chart-3)"
            />

            <Bar
              dataKey="misc"
              stackId="a"
              fill="var(--chart-4)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}