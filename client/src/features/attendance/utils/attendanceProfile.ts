import { format } from "date-fns";

type AttendanceRecordLike = {
  date: string;
  status: string;
};

const ATTENDED_STATUS_WEIGHT: Record<string, number> = {
  PRESENT: 1,
  LATE: 1,
  HALF_DAY: 0.5,
  ABSENT: 0,
  LEAVE: 0,
  HOLIDAY: 0,
};

const COUNTED_STATUS_WEIGHT: Record<string, number> = {
  PRESENT: 1,
  LATE: 1,
  HALF_DAY: 1,
  ABSENT: 1,
  LEAVE: 1,
  HOLIDAY: 0,
};

export const ATTENDANCE_STATUS_STYLES: Record<string, string> = {
  PRESENT: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  ABSENT: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  LATE: "bg-amber-500/15 text-amber-300 border-amber-400/20",
  LEAVE: "bg-sky-500/15 text-sky-300 border-sky-400/20",
  HOLIDAY: "bg-violet-500/15 text-violet-300 border-violet-400/20",
  HALF_DAY: "bg-cyan-500/15 text-cyan-300 border-cyan-400/20",
};

export const buildAttendanceTrend = (records: AttendanceRecordLike[]) => {
  const buckets = new Map<
    string,
    {
      label: string;
      attended: number;
      counted: number;
      present: number;
      absent: number;
      late: number;
      leave: number;
      halfDay: number;
    }
  >();

  [...records]
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .forEach((record) => {
      const monthKey = format(new Date(record.date), "yyyy-MM");
      const current = buckets.get(monthKey) || {
        label: format(new Date(record.date), "MMM yy"),
        attended: 0,
        counted: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        halfDay: 0,
      };

      current.attended += ATTENDED_STATUS_WEIGHT[record.status] || 0;
      current.counted += COUNTED_STATUS_WEIGHT[record.status] || 0;

      if (record.status === "PRESENT") current.present += 1;
      if (record.status === "ABSENT") current.absent += 1;
      if (record.status === "LATE") current.late += 1;
      if (record.status === "LEAVE") current.leave += 1;
      if (record.status === "HALF_DAY") current.halfDay += 1;

      buckets.set(monthKey, current);
    });

  return Array.from(buckets.values()).map((item) => ({
    ...item,
    attendanceRate: item.counted ? Number(((item.attended / item.counted) * 100).toFixed(1)) : 0,
  }));
};

export const calculateAttendanceStreak = (records: AttendanceRecordLike[]) => {
  const positiveStatuses = new Set(["PRESENT", "LATE", "HALF_DAY"]);
  let streak = 0;

  for (const record of [...records].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  )) {
    if (positiveStatuses.has(record.status)) {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
};

export const buildAttendanceDonutData = (summary: Record<string, number | string>) => {
  const items = [
    { key: "present", label: "Present", value: Number(summary.present || 0), color: "var(--chart-2)" },
    { key: "late", label: "Late", value: Number(summary.late || 0), color: "var(--chart-3)" },
    { key: "halfDay", label: "Half Day", value: Number(summary.halfDay || 0), color: "var(--chart-1)" },
    { key: "absent", label: "Absent", value: Number(summary.absent || 0), color: "var(--chart-5)" },
    { key: "leave", label: "Leave", value: Number(summary.leave || 0), color: "var(--chart-4)" },
    { key: "holiday", label: "Holiday", value: Number(summary.holiday || 0), color: "var(--chart-4)" },
  ];

  return items.filter((item) => item.value > 0);
};
