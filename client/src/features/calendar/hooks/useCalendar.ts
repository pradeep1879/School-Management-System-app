import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
  type CalendarEventPayload,
  type CalendarEventQuery,
} from "../api/calendar.api";

export const useCalendarEvents = (params?: CalendarEventQuery) => {
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: ["calendar", params, role, userId],
    queryFn: () => getCalendarEvents(params),
  });
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CalendarEventPayload) => createCalendarEvent(data),
    onSuccess: (data) => {
      toast.success(data.message || "Calendar event created");
      void queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create event");
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CalendarEventPayload }) =>
      updateCalendarEvent(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Calendar event updated");
      void queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update event");
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCalendarEvent(id),
    onSuccess: (data) => {
      toast.success(data.message || "Calendar event deleted");
      void queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });
};
