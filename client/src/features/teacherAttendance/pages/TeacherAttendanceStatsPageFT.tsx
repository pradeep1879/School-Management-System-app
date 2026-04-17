import { useParams } from "react-router-dom";



import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MyAttendanceTable from "../components/myAttendanceTable";


export default function TeacherAttendanceStatsPageFT() {
  const { teacherId } = useParams();

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Teacher Attendance Stats</CardTitle>
        </CardHeader>

        <CardContent>
          <MyAttendanceTable teacherId={teacherId} />
        </CardContent>
      </Card>

    </div>
  );
}