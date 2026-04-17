import { useParams } from "react-router-dom"
import StudentProfileHeader from "../components/StudentProfileHeader"
import { useState } from "react"
import { useStudentProfile } from "../hooks/useStudentProfile"
import StudentPerformanceTrendChart from "../components/analytics/StudentPerformanceTrendChart"
import StudentSubjectPerformanceChart from "../components/analytics/StudentSubjectPerformanceChart"
import { StudentProfileHeaderSkeleton } from "../skeleton/ProfileHeaderSkeleton"

export default function StudentProfilePageAdminTeacher() {
  const { studentId } = useParams()
  const { data, isLoading } = useStudentProfile(studentId)

  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <div className="flex ">
        <StudentProfileHeaderSkeleton/>
      </div>
    )
  }

  const student = data?.student

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <StudentProfileHeader student={student} />

      {/* TABS */}
      <div className="border-b flex gap-8">
        {["overview", "attendance", "results", "fee"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <StudentPerformanceTrendChart studentId={studentId} />
        <StudentSubjectPerformanceChart studentId={studentId} />
      </div>
      )}
      
    </div>
  )
}