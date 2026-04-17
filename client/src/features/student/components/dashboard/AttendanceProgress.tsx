import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Props {
  present: number
  absent: number
}

const AttendanceProgress = ({ present, absent }: Props) => {

  const total = present + absent
  const percentage = total ? Math.round((present / total) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <Progress value={percentage} />

        <div className="flex justify-between text-sm">
          <span>Present: {present}</span>
          <span>Absent: {absent}</span>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {percentage}% Attendance
        </div>

      </CardContent>
    </Card>
  )
}

export default AttendanceProgress