import { useQuery } from "@tanstack/react-query"
import { getStudentById, getMyStudentProfile } from "../api/student.api"
import { useAuthStore } from "@/store/auth.store"


export const useStudentProfile = (studentId?: string) => {
  const role = useAuthStore((state) => state.role)

  return useQuery({
    queryKey: ["studentProfile", studentId, role],
    queryFn: async () => {
      if (role === "student") {
        const res = await getMyStudentProfile()
        return res.data
      }

      if (!studentId) throw new Error("Student ID missing")

      const res = await getStudentById(studentId)
      return res.data
    },
    enabled: role ? true : false,
  })
}