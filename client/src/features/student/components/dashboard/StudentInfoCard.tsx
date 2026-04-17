import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Props {
  student: any
}

const StudentInfoCard = ({ student }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Name</span>
          <span className="text-muted-foreground">{student?.studentName}</span>
        </div>

        <div className="flex justify-between">
          <span>Username</span>
          <span className="text-muted-foreground">{student?.userName}</span>
        </div>

        <div className="flex justify-between">
          <span>Gender</span>
          <span className="text-muted-foreground">{student?.gender}</span>
        </div>

        <div className="flex justify-between">
          <span>Contact</span>
          <span className="text-muted-foreground">+91 {student?.contactNo}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentInfoCard