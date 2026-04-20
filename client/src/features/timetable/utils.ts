import { formatClassLabel } from "@/features/class/utils/classLabels";
import type { TimetableSlot } from "./types";

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const SHORT_DAY_LABELS = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const formatTimeLabel = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatTimeRange = (startTime: string, endTime: string) =>
  `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}`;

export const getTimeRangeKey = (slot: TimetableSlot) =>
  `${slot.startTime}-${slot.endTime}`;

export const buildTimetableRows = (slots: TimetableSlot[]) =>
  Array.from(new Set(slots.map(getTimeRangeKey))).sort((left, right) => {
    const [leftStart] = left.split("-");
    const [rightStart] = right.split("-");
    return leftStart.localeCompare(rightStart);
  });

export const isCurrentSlot = (slot: TimetableSlot, now = new Date()) => {
  if (slot.dayOfWeek !== now.getDay()) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHours, startMinutes] = slot.startTime.split(":").map(Number);
  const [endHours, endMinutes] = slot.endTime.split(":").map(Number);
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;

  return currentMinutes >= start && currentMinutes < end;
};

export const getTodaySlots = (slots: TimetableSlot[], now = new Date()) =>
  slots
    .filter((slot) => slot.dayOfWeek === now.getDay())
    .sort((left, right) => left.startTime.localeCompare(right.startTime));

export const getTimetableTitle = (slots: TimetableSlot[], fallback = "Your timetable") => {
  if (!slots.length) {
    return fallback;
  }

  const classIds = Array.from(new Set(slots.map((slot) => slot.class.id)));

  if (classIds.length === 1) {
    return formatClassLabel(slots[0].class);
  }

  return fallback;
};
