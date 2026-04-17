import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/admin.api";

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: getProfile,
  });
};