import { useQuery } from "@tanstack/react-query";
import { getTeacherClass } from "../api/class.api";
import { useAuthStore } from "@/store/auth.store";


export const useTeacherClass = (enabled: boolean) => {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ["teacher-class", userId],
    queryFn: getTeacherClass,
    enabled,
  });
};
