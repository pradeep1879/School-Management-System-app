import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const formatCurrency = (amount?: number) =>
  `₹${(amount || 0).toLocaleString()}`;

const ClassCollectionTable = ({ classes }: { classes?: any[] }) => {
  console.log("clas collection table", classes)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Collection Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {classes?.map((cls) => (
          <div
            key={cls.id}
            className="flex justify-between border p-3 gap-2 rounded-lg"
          >
            <div>
              <p className="font-medium text-xs md:text-lg">{cls.className}{cls?.section}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-xs md:text-lg">Total: {formatCurrency(cls.total)}</span>
              <span className="text-green-600 text-xs md:text-lg">
                Paid: {formatCurrency(cls.paid)}
              </span>
              <span className="text-red-600 text-xs md:text-lg">
                Due: {formatCurrency(cls.due)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClassCollectionTable;