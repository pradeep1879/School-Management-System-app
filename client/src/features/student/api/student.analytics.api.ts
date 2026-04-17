import api from "@/api/axios"


export const getStudentPerformanceTrend = async (studentId: string) => {

  if (!studentId) {
    throw new Error("Student ID is required")
  }

  const res = await api.get(
    `/analytics/student-performance/${studentId}`
  )

  return res.data
}

export const getStudentExamPerformance = async (studentId: string) => {
  if (!studentId) {
    throw new Error("Student ID is required")
  }
  const res = await api.get(
    `/analytics/student/${studentId}/exam-performance`
  )

  return res.data
}