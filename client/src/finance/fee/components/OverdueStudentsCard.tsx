import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const formatCurrency = (amount?: number) =>
  `₹${(amount || 0).toLocaleString()}`;

const OverdueStudentsCard = ({ overdueList }: { overdueList?: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Students</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {overdueList?.map((student) => (
          <div
            key={student.id}
            className="flex justify-between border p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{student.studentName}</p>
              <p className="text-xs text-muted-foreground">
                {student.className}
              </p>
            </div>
            <span className="text-red-600 font-medium">
              {formatCurrency(student.dueAmount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OverdueStudentsCard;