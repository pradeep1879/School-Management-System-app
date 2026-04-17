

import WelcomeCard from "../components/dashboard/WelcomeCard"
import StudentInfoCard from "../components/dashboard/StudentInfoCard"
import ClassInfoCard from "../components/dashboard/ClassInfoCard"
import { useStudentProfile } from "../hooks/useStudentProfile"
import StudentPerformanceTrendChart from "../components/analytics/StudentPerformanceTrendChart"
import StudentSubjectPerformanceChart from "../components/analytics/StudentSubjectPerformanceChart"

const StudentDashboard = () => {

  const { data } = useStudentProfile()

  const student = data?.student

  // Example mock data


  return (
    <div className="space-y-6">

      <WelcomeCard student={student} />

      <div className="grid md:grid-cols-2 gap-6">
        <StudentInfoCard student={student} />
        <ClassInfoCard classData={student?.class} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <StudentPerformanceTrendChart studentId={student?.id} />
        <StudentSubjectPerformanceChart studentId={student?.id} />
      </div>

    </div>
  )
}

export default StudentDashboard