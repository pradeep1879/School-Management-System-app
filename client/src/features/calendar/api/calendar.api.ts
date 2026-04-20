import api from "@/api/axios";

export type CalendarEventPayload = {
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  type: "HOLIDAY" | "EXAM" | "EVENT" | "NOTICE";
  classId?: string | null;
};

export type CalendarEventQuery = {
  startDate?: string;
  endDate?: string;
  classId?: string;
  type?: CalendarEventPayload["type"];
};

export const getCalendarEvents = async (params?: CalendarEventQuery) => {
  const res = await api.get("/calendar", { params });
  return res.data;
};

export const createCalendarEvent = async (data: CalendarEventPayload) => {
  const res = await api.post("/calendar", data);
  return res.data;
};

export const updateCalendarEvent = async (id: string, data: CalendarEventPayload) => {
  const res = await api.put(`/calendar/${id}`, data);
  return res.data;
};

export const deleteCalendarEvent = async (id: string) => {
  const res = await api.delete(`/calendar/${id}`);
  return res.data;
};
