import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useStudentDetailedResult } from "../../hooks/useResult";
import { useStudentProfile } from "@/features/student/hooks/useStudentProfile";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/features/student/hooks/useStudent";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentResultPage() {
  const { examId, studentId: paramStudentId } = useParams();
  const role = useAuthStore((s) => s.role);

  const { data: studentData } = useStudentProfile(); // for student side

  const studentId =
    role === "student" ? studentData?.student?.id : paramStudentId;

  const { data: adminTeacherStudentData } = useStudent(studentId!); // for teacher and admin side

  const { data, isLoading } = useStudentDetailedResult(examId!, studentId!);
  console.log("student reuslt", data)

  // Unified student object
  const student =
    role === "student"
      ? studentData?.student
      : adminTeacherStudentData?.student;

  if (isLoading || !student) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* ================= HEADER SKELETON ================= */}
      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
        </CardContent>
      </Card>

      {/* ================= STUDENT DETAILS SKELETON ================= */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
          {[1, 2].map((col) => (
            <div key={col} className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= SUMMARY SKELETON ================= */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton className="h-3 w-16 mx-auto" />
              <Skeleton className="h-6 w-20 mx-auto" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= SUBJECT TABLE SKELETON ================= */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-5 w-48" />

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {Array.from({ length: 4 }).map((_, i) => (
                  <th key={i} className="p-2">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 5 }).map((_, row) => (
                <tr key={row} className="border-b">
                  {Array.from({ length: 4 }).map((_, col) => (
                    <td key={col} className="p-2">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
  }
  
  if (!data) return <div className="p-6">No result found</div>;

  return (
    <div className="md:max-w-4xl mx-auto p-1 md:p-6 space-y-6">
      {/* ================= SCHOOL HEADER ================= */}
      <Card>
        <CardContent className="p-6 text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Academic Report Card{" "}
            <span className="text-gray-700 font-semibold">
              ({data?.examTitle})
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Examination Result Summary
          </p>
        </CardContent>
      </Card>

      {/* ================= STUDENT DETAILS ================= */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Student Name:</span>{" "}
              {student?.studentName}
            </p>
            <p>
              <span className="font-semibold">Roll Number:</span>{" "}
              {student?.rollNumber}
            </p>
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {student?.userName}
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Class:</span>{" "}
              {student?.class?.slug} - {student?.class?.section}
            </p>
            <p>
              <span className="font-semibold">Session:</span>{" "}
              {student?.class?.session}
            </p>
            <p>
              <span className="font-semibold">Exam ID:</span> {examId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================= SUMMARY ================= */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Marks</p>
            <p className="text-lg font-semibold">
              {data.totalObtained}/{data.totalMarks}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Percentage</p>
            <p className="text-lg font-semibold">{data.percentage}%</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Grade</p>
            <p className="text-lg font-semibold">{data.grade}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Final Result</p>
            <Badge
              className={
                data.finalStatus === "PASS"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {data.finalStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ================= SUBJECT TABLE ================= */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Subject Wise Performance</h3>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="p-2">Subject</th>
                <th className="p-2">Total</th>
                <th className="p-2">Obtained</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.subjects.map((s: any, i: number) => (
                <tr key={i} className="border-b hover:bg-muted/20 transition">
                  <td className="p-2 font-medium">{s.subjectName}</td>
                  <td className="p-2">{s.totalMarks}</td>
                  <td className="p-2">{s.obtainedMarks}</td>
                  <td className="p-2">
                    <Badge
                      className={
                        s.status === "PASS"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ================= FOOTER ================= */}
      <div className="text-xs text-muted-foreground text-center pt-4">
        This is a computer generated report card.
      </div>
    </div>
  );
}
