import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "../api/class.api";

export const useClasses = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["classes", page, limit],
    queryFn: async () => {
      const res = await getAllClasses({ page, limit });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};