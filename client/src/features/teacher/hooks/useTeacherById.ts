import { useQuery } from "@tanstack/react-query";
import { getTeacherById } from "../api/teacher.api";

export const useTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: async () => {
      const res = await getTeacherById(id);
      console.log("res.data from useTeacher",res)
      return res;

    },
    enabled: !!id,
  });
};