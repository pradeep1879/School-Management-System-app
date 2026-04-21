import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getStudentDashboardSummary } from "../api/student.api";
import { useStudentProfile } from "./useStudentProfile";
import { useCurrentClass } from "@/features/class/hooks/useCurrentClass";

export const useStudentDashboard = () => {
  const profileQuery = useStudentProfile();
  const currentClassQuery = useCurrentClass();

  const summaryQuery = useQuery({
    queryKey: ["student-dashboard-summary"],
    queryFn: getStudentDashboardSummary,
    staleTime: 1000 * 60,
  });

  const summary = summaryQuery.data?.summary;
  const student = summary?.student ?? profileQuery.data?.student;
  const classDetail = summary?.student.class ?? currentClassQuery.data?.classDetail;

  const isLoading =
    summaryQuery.isLoading ||
    profileQuery.isLoading ||
    currentClassQuery.isLoading;

  return useMemo(
    () => ({
      summary,
      student,
      classDetail,
      isLoading,
      isFetching: summaryQuery.isFetching,
      isError: summaryQuery.isError || profileQuery.isError,
      error: summaryQuery.error ?? profileQuery.error ?? null,
      refetch: summaryQuery.refetch,
    }),
    [
      classDetail,
      isLoading,
      profileQuery.error,
      profileQuery.isError,
      student,
      summary,
      summaryQuery.error,
      summaryQuery.isError,
      summaryQuery.isFetching,
      summaryQuery.refetch,
    ]
  );
};
