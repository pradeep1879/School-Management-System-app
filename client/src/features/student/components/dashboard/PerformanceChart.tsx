import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface Props {
  data: {
    subject: string
    marks: number
  }[]
}

const PerformanceChart = ({ data }: Props) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>

      <CardContent className="h-72">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="subject" />
            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="marks"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

      </CardContent>
    </Card>
  )
}

export default PerformanceChart