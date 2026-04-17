import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import { useEffect } from "react";
import { getMySalary } from "../api/salary.api";

export const useMySalary = () => {
  const query = useQuery({
    queryKey: ["my-salary"],
    queryFn: getMySalary,
  });

  useEffect(() => {
    if (query.error) {
      const error: any = query.error;

      toast.error(
        error?.response?.data?.message || "Failed to fetch salary history"
      );
    }
  }, [query.error]);

  return query;
};