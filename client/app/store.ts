import { create } from "zustand";

interface AppState {
  navState: "OPEN" | "CLOSED";
  isTimerRunning: boolean;
  setNavState: (navState: "OPEN" | "CLOSED") => void;
  setIsTimerRunning: (isRunning: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  navState: "CLOSED",
  isTimerRunning: false,
  setNavState: (navState) => set(() => ({ navState })),
  setIsTimerRunning: (isTimerRunning) => set(() => ({ isTimerRunning })),
}));
