import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Props {
  classData: any
}

const ClassInfoCard = ({ classData }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Class</span>
          <span className="text-muted-foreground">{classData?.slug}</span>
        </div>

        <div className="flex justify-between">
          <span>Section</span>
          <span className="text-muted-foreground">{classData?.section}</span>
        </div>

        <div className="flex justify-between">
          <span>Session</span>
          <span className="text-muted-foreground">{classData?.session}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassInfoCard