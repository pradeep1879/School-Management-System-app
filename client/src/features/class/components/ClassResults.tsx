import { useState } from "react"
import { Search, CheckCircle2, XCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const exams = ["Mid Term Examination", "Final Examination"]

const results = [
  {
    id: 1,
    roll: "01",
    name: "Rahul Sharma",
    total: 450,
    percentage: 90,
    grade: "A+",
    status: "Pass",
  },
  {
    id: 2,
    roll: "02",
    name: "Anita Verma",
    total: 380,
    percentage: 76,
    grade: "B+",
    status: "Pass",
  },
  {
    id: 3,
    roll: "03",
    name: "Vikas Singh",
    total: 210,
    percentage: 42,
    grade: "C",
    status: "Fail",
  },
]

export default function ClassResultsSection() {
  const [selectedExam, setSelectedExam] = useState(exams[0])
  const [search, setSearch] = useState("")

  const filteredResults = results.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Class Results
          </h2>
          <p className="text-sm text-muted-foreground">
            View and manage exam results
          </p>
        </div>

        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm sm:w-auto"
        >
          {exams.map((exam) => (
            <option key={exam}>{exam}</option>
          ))}
        </select>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {results.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pass Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">
              82%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              450 / 500
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="custom-scrollbar overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-muted/40 border-b border-border/50">
            <tr className="text-left">
              <th className="p-4">Roll</th>
              <th className="p-4">Student</th>
              <th className="p-4">Total</th>
              <th className="p-4">%</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.map((student) => (
              <tr
                key={student.id}
                className="border-b border-border/30 hover:bg-muted/30 transition"
              >
                <td className="p-4 font-medium">
                  {student.roll}
                </td>

                <td className="p-4">
                  {student.name}
                </td>

                <td className="p-4">
                  {student.total}
                </td>

                <td className="p-4">
                  {student.percentage}%
                </td>

                <td className="p-4 font-semibold">
                  {student.grade}
                </td>

                <td className="p-4">
                  <Badge
                    variant={
                      student.status === "Pass"
                        ? "secondary"
                        : "destructive"
                    }
                    className="flex items-center gap-1 w-fit"
                  >
                    {student.status === "Pass" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {student.status}
                  </Badge>
                </td>

                <td className="p-4 text-right">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
