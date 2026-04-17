

import {
 Card,
 CardHeader,
 CardTitle,
 CardContent
} from "@/components/ui/card"

import {
 Table,
 TableHeader,
 TableRow,
 TableHead,
 TableBody,
 TableCell
} from "@/components/ui/table"

type Payment = {
 id:string
 studentName:string
 amount:number
 method:string
 paymentDate:string
}

interface Props {
 data?: Payment[]
}

export default function RecentPayments({ data }: Props){

 if(!data || data.length === 0){
   return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        No payments found
      </CardContent>
    </Card>
   )
 }

 return(
  <Card className="shadow-sm w-88 sm:w-full">

    <CardHeader>
      <CardTitle>Recent Payments</CardTitle>
    </CardHeader>

    <CardContent>

      <Table>

        <TableHeader >
          <TableRow >
            <TableHead>Student</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

        {data.map((p)=>(
          <TableRow key={p.id}>
            <TableCell>{p.studentName}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>
              {new Date(p.paymentDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right font-semibold text-green-600">
              ₹{p.amount}
            </TableCell>
          </TableRow>
        ))}

        </TableBody>

      </Table>

    </CardContent>

  </Card>
 )
}