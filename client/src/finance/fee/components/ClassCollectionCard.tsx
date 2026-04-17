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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-blue-500">
        <CardContent className="p-4 flex items-center gap-4">
          <Wallet className="text-blue-500" />
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
        <CardContent className="p-4 flex items-center gap-4">
          <TrendingUp className="text-green-500" />
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
        <CardContent className="p-4 flex items-center gap-4">
          <AlertTriangle className="text-red-500" />
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
        <CardContent className="p-4 flex items-center gap-4">
          <CheckCircle2 className="text-purple-500" />
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