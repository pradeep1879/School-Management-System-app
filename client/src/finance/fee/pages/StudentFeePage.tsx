import { Card,  } from "@/components/ui/card";
import InstallmentTable from "../components/InstallmentTable";
import PaymentHistoryTable from "../components/PaymentHistoryTable";
import { useMyFeeSummary } from "../hooks/useMyFeeSummary";
import CountUp from "react-countup";
import MyFeeSkeleton from "../skeletons/MyFeeSkeleton";



const MyFeePage = () => {
  const { data, isLoading } = useMyFeeSummary();
  console.log("myFeePage ", data)

  if (isLoading) return <MyFeeSkeleton/>;
  
  return (
    <div className="px-3 space-y-6">
      <h1 className="text-3xl font-bold">
        My Fees
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3  gap-4">
        <Card className="p-4 text-center border">
          <p className="text-sm text-muted-foreground">
            Total
          </p>
          <p className="text-lg font-semibold">
            <CountUp
              end={data?.summary?.totalAmount || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
          </p>
        </Card>

        <Card className="p-4 text-center border border-green-200 bg-green-50">
          <p className="text-sm text-muted-foreground">
            Paid
          </p>
          <p className="text-lg font-semibold text-green-600">
            <CountUp
              end={data?.summary?.paidAmount || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
          </p>
        </Card>

        <Card className="p-4 text-center border border-red-200 bg-red-50">
          <p className="text-sm text-muted-foreground">
            Due
          </p>
          <p className="text-lg font-semibold text-red-600">
            <CountUp
              end={data?.summary?.dueAmount || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
          </p>
        </Card>
      </div>

      {/* Installments */}
      <InstallmentTable
        installments={data?.installments || []}
        studentId={""} // No collect button for student
      />

      {/* Payment History */}
      <PaymentHistoryTable
        payments={data?.payments || []}
      />
    </div>
  );
};

export default MyFeePage;