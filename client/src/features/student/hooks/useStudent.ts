import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "../api/student.api";
import api from "@/api/axios";


export const useStudent = (studentId: string) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res = await getStudentById(studentId);
      return res.data;
    },
    enabled: !!studentId,
  });
};

export const useStudentClass = (enabled: boolean) => {
  return useQuery({
    queryKey: ["student-class"],
    queryFn: async () => {
      const res = await api.get("/students/my-class");
      console.log("useStudentClass", res)
      return res.data;
    },
    enabled,
  });
};