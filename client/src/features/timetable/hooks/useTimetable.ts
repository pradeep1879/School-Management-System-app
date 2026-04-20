import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import {
  createTimetableSlot,
  deleteTimetableSlot,
  getMyTimetable,
  getTimetableByClass,
  updateTimetableSlot,
  type TimetablePayload,
} from "../api/timetable.api";

export const useClassTimetable = (classId?: string) => {
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ["timetable", "class", classId, role, userId],
    queryFn: () => getTimetableByClass(classId!),
    enabled: Boolean(classId),
  });
};

export const useMyTimetable = (enabled = true) => {
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ["timetable", "my", role, userId],
    queryFn: getMyTimetable,
    enabled,
  });
};

const invalidateTimetableQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ["timetable"] });
};

export const useCreateTimetableSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TimetablePayload) => createTimetableSlot(data),
    onSuccess: (data) => {
      toast.success(data.message || "Timetable slot created");
      invalidateTimetableQueries(queryClient);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create timetable slot");
    },
  });
};

export const useUpdateTimetableSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TimetablePayload }) =>
      updateTimetableSlot(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Timetable slot updated");
      invalidateTimetableQueries(queryClient);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update timetable slot");
    },
  });
};

export const useDeleteTimetableSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTimetableSlot(id),
    onSuccess: (data) => {
      toast.success(data.message || "Timetable slot deleted");
      invalidateTimetableQueries(queryClient);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete timetable slot");
    },
  });
};
