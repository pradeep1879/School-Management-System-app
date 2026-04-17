import PendingAttendanceTable from "../components/PendingAttendanceTable";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function AdminTeacherAttendancePage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border bg-card/70 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-2xl tracking-tight">
            Teacher Attendance Requests
          </CardTitle>
          <CardDescription>
            Review daily attendance submissions, approve verified records, and reject incorrect entries in one place.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PendingAttendanceTable />
        </CardContent>
      </Card>

    </div>
  );
}
