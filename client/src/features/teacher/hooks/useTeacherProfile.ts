import { useQuery } from "@tanstack/react-query";
import { getTeacherProfile } from "../api/teacher.api";


export const useTeacherProfile = () => {
  return useQuery({
    queryKey: ["teacher-profile"],
    queryFn: getTeacherProfile,
  });
};