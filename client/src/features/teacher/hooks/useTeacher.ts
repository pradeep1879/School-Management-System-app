  import {  useQuery } from "@tanstack/react-query";
  import { getAllTeachers } from "../api/teacher.api";

export const useTeachers = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["teachers", page, limit],
    queryFn: () => getAllTeachers({ page, limit }),
    placeholderData: (previousData) => previousData,
  });
};

