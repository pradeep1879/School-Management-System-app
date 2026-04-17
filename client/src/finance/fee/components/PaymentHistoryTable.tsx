import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Payment {
  id: string;
  receiptNo: string;
  amount: number;
  paymentDate: string;
  method: string;
}

interface Props {
  payments?: Payment[];
}

const formatCurrency = (amount?: number) =>
  `₹${(amount || 0).toLocaleString()}`;

const PaymentHistoryTable = ({ payments }: Props) => {
  console.log(payments)
  return (
    <Card >
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>

      <CardContent className="overflow-x-auto custom-scrollbar">
        <Table className="min-w-162.5">
          <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Receipt</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
          <TableBody>
            {payments?.length === 0 && (
              <TableRow>
                <TableCell>No payments yet</TableCell>
              </TableRow>
            )}

            {payments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  {payment.receiptNo}
                </TableCell>

                <TableCell>
                  {payment.method}
                </TableCell>

                <TableCell className="text-green-600 text-right font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryTable;