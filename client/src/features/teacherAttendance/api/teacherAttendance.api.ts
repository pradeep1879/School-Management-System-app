import api from "@/api/axios";
import { getTeacherById } from "@/features/teacher/api/teacher.api";

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
  try {
    const res = await api.get(`/teacher/attendance/profile/${teacherId}`);
    return res.data;
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      throw error;
    }

    const [teacherResponse, history] = await Promise.all([
      getTeacherById(teacherId),
      getTeacherAttendanceHistoryById(teacherId),
    ]);

    const teacher = teacherResponse?.teacher;

    if (!teacher) {
      throw error;
    }

    const summary = {
      totalDays: history.length,
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0,
      holiday: 0,
      attendancePercentage: "0.00",
    };

    history.forEach((record: any) => {
      switch (record.status) {
        case "PRESENT":
          summary.present += 1;
          break;
        case "ABSENT":
          summary.absent += 1;
          break;
        case "LEAVE":
          summary.leave += 1;
          break;
        case "HALF_DAY":
          summary.halfDay += 1;
          break;
        case "HOLIDAY":
          summary.holiday += 1;
          break;
      }
    });

    const counted = summary.present + summary.absent + summary.leave + summary.halfDay;
    const attended = summary.present + summary.halfDay * 0.5;

    summary.attendancePercentage = counted
      ? ((attended / counted) * 100).toFixed(2)
      : "0.00";

    return {
      success: true,
      teacher,
      summary,
      history,
    };
  }
};
