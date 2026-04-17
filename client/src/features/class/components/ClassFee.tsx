import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const students = [
  { id: 1, name: "Rahul Sharma", totalFee: 50000, paid: 30000 },
  { id: 2, name: "Anita Verma", totalFee: 50000, paid: 45000 },
]

export default function CollectFeeSection() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  method;

  const pending = selectedStudent
    ? selectedStudent.totalFee - selectedStudent.paid
    : 0

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold">
          Collect Fee
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a student and record fee payment
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE - FORM */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Add Payment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Student Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Student
              </label>

              <Select
                onValueChange={(value) => {
                  const student = students.find(
                    (s) => s.id === Number(value)
                  )
                  setSelectedStudent(student)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose student..." />
                </SelectTrigger>

                <SelectContent>
                  {students.map((student) => (
                    <SelectItem
                      key={student.id}
                      value={String(student.id)}
                    >
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Payment Amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Payment Method
              </label>

              <Select onValueChange={(val) => setMethod(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank">
                    Bank Transfer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Payment Note
              </label>
              <Textarea placeholder="Optional note..." />
            </div>

            {/* Submit */}
            <Button className="w-full gap-2">
              <Plus size={16} />
              Record Payment
            </Button>

          </CardContent>
        </Card>

        {/* RIGHT SIDE - SUMMARY */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {selectedStudent ? (
              <>
                <div className="flex justify-between">
                  <span>Total Fee</span>
                  <span className="font-medium">
                    ₹{selectedStudent.totalFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Paid</span>
                  <span className="text-green-600 font-medium">
                    ₹{selectedStudent.paid}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3">
                  <span>Pending</span>
                  <span className="text-red-500 font-semibold">
                    ₹{pending}
                  </span>
                </div>

                <Badge
                  variant={
                    pending === 0
                      ? "secondary"
                      : "destructive"
                  }
                  className="w-full justify-center"
                >
                  {pending === 0
                    ? "Fully Paid"
                    : "Payment Pending"}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a student to view fee details
              </p>
            )}

          </CardContent>
        </Card>

      </div>

    </div>
  )
}