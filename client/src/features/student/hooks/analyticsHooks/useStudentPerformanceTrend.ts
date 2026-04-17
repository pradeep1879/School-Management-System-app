import { useQuery } from "@tanstack/react-query"
import { getStudentExamPerformance, getStudentPerformanceTrend } from "../../api/student.analytics.api"
import api from "@/api/axios"


export const useStudentPerformanceTrend = (studentId: string) => {

  return useQuery({
    queryKey: ["student-performance-trend", studentId],
    queryFn: () => getStudentPerformanceTrend(studentId),
    enabled: !!studentId
  })

}

export const useStudentExamPerformance = (studentId?: string) => {

  return useQuery({
    queryKey: ["student-exam-performance", studentId],
    queryFn: () => getStudentExamPerformance(studentId!),
    enabled: !!studentId
  })

}


export const useStudentExamSubjects = (
  studentId?: string,
  examId?: string
) => {

  return useQuery({
    queryKey: ["student-exam-subjects", studentId, examId],
    queryFn: async () => {

      const res = await api.get(
        `/analytics/student/${studentId}/exam/${examId}`
      )

      return res.data
    },
    enabled: !!studentId && !!examId
  })
}