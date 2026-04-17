import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

const statusColor: Record<string, string> = {
  PRESENT: "bg-green-600",
  ABSENT: "bg-red-600",
  LEAVE: "bg-yellow-500",
  HALF_DAY: "bg-orange-500",
  HOLIDAY: "bg-blue-500",
};

export default function AttendanceStatusBadge({ status }: Props) {
  return (
    <Badge className={`${statusColor[status]} text-white`}>
      {status.replace("_", " ")}
    </Badge>
  );
}