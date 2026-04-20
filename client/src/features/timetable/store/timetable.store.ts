import { create } from "zustand";

type TimetableUiState = {
  selectedClassId: string;
  selectedDay: number;
  setSelectedClassId: (value: string) => void;
  setSelectedDay: (value: number) => void;
};

export const useTimetableStore = create<TimetableUiState>((set) => ({
  selectedClassId: "",
  selectedDay: new Date().getDay(),
  setSelectedClassId: (value) => set({ selectedClassId: value }),
  setSelectedDay: (value) => set({ selectedDay: value }),
}));
