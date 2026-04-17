import { Badge } from "@/components/ui/badge";

interface Props {
  status: "PENDING" | "APPROVED" | "PAID";
}

export default function SalaryStatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
    PAID: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <Badge
      variant="outline"
      className={`capitalize ${styles[status]}`}
    >
      {status.toLowerCase()}
    </Badge>
  );
}