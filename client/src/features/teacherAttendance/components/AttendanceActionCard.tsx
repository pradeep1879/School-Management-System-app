import { CalendarCheck, CalendarX, Clock } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSubmitAttendance } from "../hooks/useSubmitAttendance";
import { useTodayAttendance } from "../hooks/useMyAttendance";


export default function AttendanceActionCard() {
  const { mutate, isPending } = useSubmitAttendance();
  const { data } = useTodayAttendance();


  const handleSubmit = (status: string) => {
    mutate({ status });
  };

  const alreadySubmitted = !!data;

  return (
    <Card className="shadow-md border-border/60">
      <CardHeader>
        <CardTitle>Send request to Admin</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Present */}
        <Button
          disabled={isPending || alreadySubmitted}
          onClick={() => handleSubmit("PRESENT")}
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <CalendarCheck size={16} />
          Mark Present
        </Button>

        {/* Absent */}
        <Button
          disabled={isPending || alreadySubmitted}
          onClick={() => handleSubmit("ABSENT")}
          variant="destructive"
          className="w-full gap-2"
        >
          <CalendarX size={16} />
          Mark Absent
        </Button>

        {/* Leave */}
        <Button
          disabled={isPending || alreadySubmitted}
          onClick={() => handleSubmit("LEAVE")}
          variant="outline"
          className="w-full gap-2"
        >
          <Clock size={16} />
          Request Leave
        </Button>

        {/* Status Section */}

        {data && (
          <div className="p-3 rounded-lg bg-muted text-sm">

            <p>
              Status: <strong>{data.status}</strong>
            </p>

            <p>
              Admin Approval:{" "}
              <strong className="capitalize">
                {data.approvalStatus.toLowerCase()}
              </strong>
            </p>

            {data.approvalStatus === "REJECTED" && (
              <p className="text-red-500 text-sm mt-1">
                Reason: {data.rejectionReason}
              </p>
            )}

          </div>
        )}

      </CardContent>
    </Card>
  );
}