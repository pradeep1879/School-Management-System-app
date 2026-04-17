import { useQuery } from "@tanstack/react-query";
import { getTeacherClass } from "../api/class.api";


export const useTeacherClass = (enabled: boolean) => {
  return useQuery({
    queryKey: ["teacher-class"],
    queryFn: getTeacherClass,
    enabled,
  });
};