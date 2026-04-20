import api from "@/api/axios";

/* Teacher Submit Attendance */

export const submitAttendance = async (data: {
  status: string;
  note?: string;
}) => {
  const res = await api.post("/teacher/attendance/submit", data);
  return res.data;
};

/* Teacher Attendance History */

export const getMyAttendance = async () => {
  const res = await api.get("/teacher/attendance/me");
    console.log("getmyAttendance from api", res.data)
  return res.data;
};

export const getTodayAttendance = async () => {
  const res = await api.get("/teacher/attendance/today");
  console.log("get today attendance", res);
  return res.data;
};

/* Admin Pending Requests */

export const getPendingAttendance = async () => {
  const res = await api.get("/teacher/attendance/pending");
  return res.data;
};

/* Admin Approve */

export const approveAttendance = async (attendanceId: string) => {
  const res = await api.patch(`/teacher/attendance/${attendanceId}/approve`);
  return res.data;
};

/* Admin Reject */

export const rejectAttendance = async (data: {
  attendanceId: string;
  reason: string;
}) => {
  const res = await api.patch(
    `/teacher/attendance/${data.attendanceId}/reject`,
    { reason: data.reason }
  );

  return res.data;
};

export const getTeacherAttendanceHistory = async () => {
  const res = await api.get("/teacher/attendance/history");
  return res.data;
};

export const getTeacherAttendanceHistoryById = async (teacherId: string) => {
  const res = await api.get(`/teacher/attendance/teacher/${teacherId}`);
  console.log("getTeacherAttendancehistoryById from api", res.data)
  return res.data;
};

export const getTeacherAttendanceStats = async () => {
  const res = await api.get("/teacher/attendance/stats");
  return res.data;
};

export const getTeacherAttendanceProfile = async (teacherId: string) => {
  const res = await api.get(`/teacher/attendance/profile/${teacherId}`);
  return res.data;
};
