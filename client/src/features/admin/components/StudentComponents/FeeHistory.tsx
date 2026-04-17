import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"

const feeData = [
  {
    receipt: "RCPT-001",
    amount: 3500,
    date: "01 Mar 2026",
    time: "10:45 AM",
    method: "UPI",
    status: "Paid",
    remark: "Monthly Fee - March",
  },
  {
    receipt: "RCPT-002",
    amount: 3500,
    date: "01 Feb 2026",
    time: "09:20 AM",
    method: "Cash",
    status: "Paid",
    remark: "Monthly Fee - February",
  },
  {
    receipt: "RCPT-003",
    amount: 3500,
    date: "-",
    time: "-",
    method: "-",
    status: "Pending",
    remark: "Monthly Fee - April",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
          Paid
        </Badge>
      )
    case "Pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          Pending
        </Badge>
      )
    case "Overdue":
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400">
          Overdue
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

export default function StudentFeeTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Payment History</CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt No</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Remark</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {feeData.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/40 transition"
              >
                <TableCell className="font-medium">
                  {item.receipt}
                </TableCell>

                <TableCell className="flex items-center gap-1">
                  <IndianRupee size={14} />
                  {item.amount}
                </TableCell>

                <TableCell>{item.date}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.method}</TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.remark}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
