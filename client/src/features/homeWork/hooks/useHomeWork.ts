import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as homeworkApi from "../api/homework.api";
import { toast } from "sonner";

export const useHomework = (classId?: string) => {
  return useQuery({
    queryKey: ["homework", classId],
    queryFn: () => homeworkApi.getHomeworkByClass(classId!),
    enabled: !!classId,
  });
};

export const useCreateHomework = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeworkApi.createHomework,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homework", classId],
      });
      toast.success("Homework created successfully");
    },
  });
};

export const useUpdateHomeworkStatus = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      homeworkId,
      status,
    }: {
      homeworkId: string;
      status: string;
    }) => homeworkApi.updateHomeworkStatus(homeworkId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homework", classId],
      });
      toast.success("Status updated");
    },
  });
};

export const useDeleteHomework = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeworkApi.deleteHomework,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["homework", classId],
      });
      toast.success("Homework deleted");
    },
  });
};