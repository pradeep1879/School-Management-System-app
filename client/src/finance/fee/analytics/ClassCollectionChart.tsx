import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useIsMobile from "@/screen.detector"

type ClassData = {
  className: string
  total: number
  paid: number
  due: number
}

interface Props {
  data?: ClassData[]
}

export default function ClassCollectionChart({ data }: Props) {
  const isMobile = useIsMobile()

  const barWidth = isMobile ? 8 : 28

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Collection</CardTitle>
        </CardHeader>

        <CardContent className="h-56 sm:h-72 flex items-center justify-center text-muted-foreground">
          No class data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm w-88 sm:w-full border bg-slate-900">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base font-semibold text-white">
          Class Wise Collection
        </CardTitle>
      </CardHeader>

      <CardContent className="h-70 sm:h-80">

        <ResponsiveContainer width="108%" height="100%">

          <BarChart
            data={data}
            barSize={barWidth}
            barGap={8}
            barCategoryGap="25%"
          >

            {/* Gradients */}
            <defs>
              <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8}/>
              </linearGradient>

                <linearGradient id="dueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />

            {/* X Axis */}
            <XAxis
              dataKey="className"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            {/* Tooltip */}
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1f2937",
                borderRadius: "10px",
                color: "#fff"
              }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{
                fontSize: "13px",
                paddingTop: "10px",
                color: "#d1d5db"
              }}
            />

            {/* Paid Bar */}
            <Bar
              dataKey="paid"
              name="Paid"
              fill="url(#paidGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            />

            {/* Due Bar */}
            <Bar
              dataKey="due"
              name="Due"
              fill="url(#dueGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            />

          </BarChart>

        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}