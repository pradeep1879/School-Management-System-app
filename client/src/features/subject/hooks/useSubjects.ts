import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject, getSubjectsByClass, updateSubject } from "../api/subject.api";
import { toast } from "sonner";


export const useSubjects = (classId: string) => {
  return useQuery({
    queryKey: ["subjects", classId],
    queryFn: () => getSubjectsByClass(classId),
    enabled: !!classId,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: (res, variables) => {
      toast.success(res?.data?.message || "Subject created");
      queryClient.invalidateQueries({
        queryKey: ["subjects", variables.classId],
      });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => updateSubject(id, data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Subject created");
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },
  });
};