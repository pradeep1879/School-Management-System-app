import api from "@/api/axios";

export type TimetablePayload = {
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room?: string | null;
};

export const getTimetableByClass = async (classId: string) => {
  const res = await api.get(`/timetable/class/${classId}`);
  return res.data;
};

export const getMyTimetable = async () => {
  const res = await api.get("/timetable/my");
  return res.data;
};

export const createTimetableSlot = async (data: TimetablePayload) => {
  const res = await api.post("/timetable", data);
  return res.data;
};

export const updateTimetableSlot = async (id: string, data: TimetablePayload) => {
  const res = await api.put(`/timetable/${id}`, data);
  return res.data;
};

export const deleteTimetableSlot = async (id: string) => {
  const res = await api.delete(`/timetable/${id}`);
  return res.data;
};
