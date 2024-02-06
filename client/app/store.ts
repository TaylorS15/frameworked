import { create } from "zustand";

interface AppState {
  navState: "OPEN" | "CLOSED";
  currentCode: string;
  isTimerRunning: boolean;
  isFetchingChallenge: boolean;
  setNavState: (navState: "OPEN" | "CLOSED") => void;
  setCurrentCode: (code: string) => void;
  setIsTimerRunning: (isRunning: boolean) => void;
  setIsFetchingChallenge: (isFetching: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  navState: "CLOSED",
  currentCode: "",
  isTimerRunning: false,
  isFetchingChallenge: false,
  setNavState: (navState) => set(() => ({ navState })),
  setCurrentCode: (currentCode) => set(() => ({ currentCode })),
  setIsTimerRunning: (isTimerRunning) => set(() => ({ isTimerRunning })),
  setIsFetchingChallenge: (isFetchingChallenge) =>
    set(() => ({ isFetchingChallenge })),
}));
