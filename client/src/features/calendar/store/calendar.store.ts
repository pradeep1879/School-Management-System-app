import { create } from "zustand";

type CalendarView = "month" | "week";

type CalendarUiState = {
  view: CalendarView;
  selectedDate: Date;
  selectedClassId: string;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedClassId: (classId: string) => void;
};

export const useCalendarStore = create<CalendarUiState>((set) => ({
  view: "month",
  selectedDate: new Date(),
  selectedClassId: "ALL_CLASSES",
  setView: (view) => set({ view }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedClassId: (selectedClassId) => set({ selectedClassId }),
}));
