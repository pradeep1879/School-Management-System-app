import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { getTeacherSalaries } from "../api/salary.api";

export const useTeacherSalaries = () => {
  const query = useQuery({
    queryKey: ["teacher-salaries"],
    queryFn: getTeacherSalaries,
  });

  useEffect(() => {
    if (query.error) {
      const error: any = query.error;
      toast.error(
        error?.response?.data?.message || "Failed to fetch salary records"
      );
    }
  }, [query.error]);

  return query;
};