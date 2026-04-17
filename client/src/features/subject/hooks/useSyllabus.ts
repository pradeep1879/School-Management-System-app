import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSyllabus, getSyllabus } from "../api/syllabus.api";
import { toast } from "sonner";
import api from "@/api/axios";

export const useSyllabus = (subjectId: string) =>
  useQuery({
    queryKey: ["syllabus", subjectId],
    queryFn: async () => {
      const res = await getSyllabus(subjectId);
      return res.data;
    },
    enabled: !!subjectId,
  });

export const useCreateSyllabus = (subjectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await createSyllabus(data);
      return res.data;
    },

    onSuccess: (res) => {
      toast.success(res?.message || "Syllabus added successfully");

      queryClient.invalidateQueries({
        queryKey: ["syllabus", subjectId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add syllabus"
      );
    },
  });
};


export const useUpdateChapterStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chapterId,
      status,
    }: {
      chapterId: string;
      status: string;
    }) => {
      const res = await api.patch(
        `/syllabus/${chapterId}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syllabus"] });
    },
  });
};