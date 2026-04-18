import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import CountUp from 'react-countup'

interface Props {
  totalAmount?: number;
  totalPaid?: number;
  totalDue?: number;
  todayCollection?: number;
}

const ClassCollectionCard = ({
  totalAmount,
  totalPaid,
  totalDue,
  todayCollection,
}: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-l-4 border-blue-500">
        <CardContent className="flex items-start gap-4 p-4">
          <Wallet className="mt-1 shrink-0 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xl font-semibold">
            <CountUp
              end={totalAmount || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
          </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-green-500">
        <CardContent className="flex items-start gap-4 p-4">
          <TrendingUp className="mt-1 shrink-0 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-xl font-semibold text-green-600">
              <CountUp
              end={totalPaid || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-red-500">
        <CardContent className="flex items-start gap-4 p-4">
          <AlertTriangle className="mt-1 shrink-0 text-red-500" />
          <div>
            <p className="text-sm text-muted-foreground">Due</p>
            <p className="text-xl font-semibold text-red-600">
              <CountUp
              end={totalDue || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-purple-500">
        <CardContent className="flex items-start gap-4 p-4">
          <CheckCircle2 className="mt-1 shrink-0 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-xl font-semibold">
              <CountUp
              end={todayCollection || 0 }
              duration={1.5}
              separator=","
              prefix="₹"
            />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassCollectionCard;
