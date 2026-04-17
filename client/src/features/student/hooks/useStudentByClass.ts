import { useQuery } from "@tanstack/react-query";
import { getStudentsByClass } from "../api/student.api";


export const useStudentsByClass = (
  classId: string,
  page: number,
  limit: number,
  search: string
) => {
  return useQuery({
    queryKey: ["students", classId, page, limit, search],
    queryFn: async () => {
      const res = await getStudentsByClass(classId, {
        page,
        limit,
        search,
      });
      return res.data;
    },
    enabled: !!classId,
    placeholderData: (prev) => prev,
  });
};