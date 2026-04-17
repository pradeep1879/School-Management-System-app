import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import InstallmentTable from "./InstallmentTable";
import CountUp from "react-countup";


interface Props {
  feeData: any;
  loading: boolean;
  studentId: string | null;
}

const StudentFeeDetails = ({
  feeData,
  loading,
  studentId,
}: Props) => {
  

  return (
    <Card className="custom-scrollbar h-162.5 overflow-y-auto xl:col-span-2">
      <CardHeader>
        <CardTitle>Student Fee Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* 🚫 No Student Selected */}
        {!studentId && (
          <div className="flex items-center justify-center h-100 text-sm text-muted-foreground">
            Select a student to view fee details.
          </div>
        )}

        {/* 🔥 Loading Skeleton */}
        {studentId && loading && (
          <>
            {/* Summary Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-24" />
                </Card>
              ))}
            </div>

            {/* Installment Skeleton */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </>
        )}

        {/*  Actual Data */}
        {studentId && !loading && feeData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center border hover:shadow-sm transition">
                <p className="text-sm text-muted-foreground">
                  Total
                </p>
                <p className="text-sm md:text-lg font-semibold">
                 <CountUp
                    end={feeData?.summary?.totalAmount || 0 }
                    duration={1.5}
                    separator=","
                    prefix="₹"
                  />
                </p>
              </Card>

              <Card className="p-4 text-center border border-green-200 bg-green-50 hover:shadow-sm transition">
                <p className="text-sm text-muted-foreground">
                  Paid
                </p>
                <p className="text-sm md:text-lg font-semibold text-green-600">
                  <CountUp
                    end={feeData?.summary?.paidAmount || 0 }
                    duration={1.5}
                    separator=","
                    prefix="₹"
                  />
                </p>
              </Card>

              <Card className="p-4 text-center border border-red-200 bg-red-50 hover:shadow-sm transition">
                <p className="text-sm text-muted-foreground">
                  Due
                </p>
                <p className="text-sm md:text-lg font-semibold text-red-600">
                  <CountUp
                    end={feeData?.summary?.dueAmount || 0 }
                    duration={1.5}
                    separator=","
                    prefix="₹"
                  />
                </p>
              </Card>
            </div>

            {/* Installments */}
            <InstallmentTable
              installments={feeData.installments || []}
              studentId={studentId}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentFeeDetails;
