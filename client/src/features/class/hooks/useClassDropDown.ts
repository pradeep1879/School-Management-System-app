import { useQuery } from "@tanstack/react-query";
import { getClassDropdown } from "../api/class.api";

export const useClassDropdown = (enabled = true) => {
  return useQuery({
    queryKey: ["class-dropdown"],
    queryFn: getClassDropdown,
    enabled,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};
