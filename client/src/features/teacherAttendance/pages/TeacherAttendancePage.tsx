import AttendanceActionCard from "../components/AttendanceActionCard";


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MyAttendanceTable from "../components/myAttendanceTable";


export default function TeacherAttendancePage() {
  return (
    <div className="space-y-8">

      {/* Submit Attendance */}
      <AttendanceActionCard />

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>My Attendance History</CardTitle>
        </CardHeader>

        <CardContent>
          <MyAttendanceTable />
        </CardContent>
      </Card>

    </div>
  );
}