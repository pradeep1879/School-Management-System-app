
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6"
]

type Payment = {
  method: string
  amount: number
}

interface Props {
  payments?: Payment[]
}

export default function PaymentMethodChart({ payments }: Props) {

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>

        <CardContent className="h-75 flex items-center justify-center text-muted-foreground">
          No payment data available
        </CardContent>
      </Card>
    )
  }

  const methodMap: Record<string, number> = {}

  payments.forEach((p) => {
    methodMap[p.method] = (methodMap[p.method] || 0) + p.amount
  })

  const data = Object.entries(methodMap).map(([method, amount]) => ({
    method,
    amount
  }))

  return (
    <Card className="shadow-sm w-88 sm:w-full border">

      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Payment Method Distribution
        </CardTitle>
      </CardHeader>

      <CardContent className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="amount"
              nameKey="method"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              stroke="none"
            >

              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "13px"
              }}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                paddingTop: "10px"
              }}
            />

          </PieChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>
  )
}

