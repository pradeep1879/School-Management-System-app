import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { getTeacherProfile } from "../api/teacher.api";


export const useTeacherProfile = () => {
  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);

  return useQuery({
    queryKey: ["teacher-profile", role, userId],
    queryFn: getTeacherProfile,
    enabled: role === "teacher" && Boolean(userId),
  });
};
