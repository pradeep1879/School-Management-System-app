import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"
import CountUp from "react-countup"

interface Props {
  title: string
  value?: number
  icon: LucideIcon
  color: string

  present?: number
  absent?: number
  leave?: number
  holiday?: number
}

const DashboardTopCard = ({
  title,
  value,
  icon: Icon,
  color,
  present = 0,
  absent = 0,
  leave = 0,
  holiday = 0,
}: Props) => {

  const total = present + absent + leave + holiday

  const presentPercent = total ? (present / total) * 100 : 0
  const absentPercent = total ? (absent / total) * 100 : 0
  const leavePercent = total ? (leave / total) * 100 : 0
  const holidayPercent = total ? (holiday / total) * 100 : 0

  return (
    <Card className={`border-l-4 ${color} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardContent className="p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">

          <div className={`p-2 rounded-lg bg-muted`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{title}</p>

            <p className="text-2xl font-bold">
              <CountUp end={value || 0} duration={1.5} separator="," />
            </p>
          </div>

        </div>

        {/* Attendance Progress */}
        {total > 0 && (
          <div className="space-y-3">

            {/* Stacked progress */}
            <div className="flex w-full h-2 overflow-hidden rounded-full">

              <div
                className="bg-green-500 transition-all"
                style={{ width: `${presentPercent}%` }}
              />

              <div
                className="bg-red-500 transition-all"
                style={{ width: `${absentPercent}%` }}
              />

              <div
                className="bg-yellow-400 transition-all"
                style={{ width: `${leavePercent}%` }}
              />

              <div
                className="bg-blue-400 transition-all"
                style={{ width: `${holidayPercent}%` }}
              />

            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Present {present}
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Absent {absent}
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Leave {leave}
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Holiday {holiday}
              </div>

            </div>

          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default DashboardTopCard