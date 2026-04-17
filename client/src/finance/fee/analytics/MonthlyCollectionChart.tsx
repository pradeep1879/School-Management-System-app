
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Payment = {
  amount: number
  paymentDate: string
}

interface Props {
  payments?: Payment[]
}

export default function MonthlyCollectionChart({ payments }: Props) {

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Collection</CardTitle>
        </CardHeader>

        <CardContent className="h-75 flex items-center justify-center text-muted-foreground">
          No payment data available
        </CardContent>
      </Card>
    )
  }

  const monthMap: Record<string, number> = {}

  payments.forEach((p) => {
    const month = new Date(p.paymentDate).toLocaleString("default",{month:"short"})
    monthMap[month] = (monthMap[month] || 0) + p.amount
  })

  const data = Object.entries(monthMap).map(([month,amount]) => ({
    month,
    amount
  }))

  return (
    <Card className="shadow-sm w-88 sm:w-full border">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Monthly Collection Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "13px"
              }}
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "#6366f1"
              }}
              activeDot={{
                r: 6
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}

