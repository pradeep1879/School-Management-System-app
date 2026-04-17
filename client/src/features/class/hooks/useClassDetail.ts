import { useQuery } from "@tanstack/react-query";
import { getClassById } from "../api/class.api";

export const useClassDetail = (
  id?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["class-detail", id],
    queryFn: () => getClassById(id!),
    enabled: !!id && enabled,
  });
};