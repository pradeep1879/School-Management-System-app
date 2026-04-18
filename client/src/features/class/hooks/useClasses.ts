import { useQuery } from "@tanstack/react-query";
import { getAllClasses } from "../api/class.api";

export const useClasses = (
  page: number,
  limit: number,
  session?: string
) => {
  return useQuery({
    queryKey: ["classes", page, limit, session],
    queryFn: async () => {
      const res = await getAllClasses({
        page,
        limit,
        ...(session && { session }),
      });
      return res.data;
    },
    placeholderData: (prev) => prev,
  });
};
