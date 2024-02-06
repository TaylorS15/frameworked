import { create } from "zustand";

interface AppState {
  navState: "OPEN" | "CLOSED";
  codeFiles: {
    [fileName: string]: string;
  };
  currentCode: {
    fileName: string;
    code: string;
  };
  isTimerRunning: boolean;
  isFetchingChallenge: boolean;
  setNavState: (navState: "OPEN" | "CLOSED") => void;
  setCodeFiles: (codeFiles: { [key: string]: string }) => void;
  setCurrentCode: (fileName: string, code: string) => void;
  setIsTimerRunning: (isRunning: boolean) => void;
  setIsFetchingChallenge: (isFetching: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  navState: "CLOSED",
  codeFiles: {},
  currentCode: {
    fileName: "",
    code: "",
  },
  isTimerRunning: false,
  isFetchingChallenge: false,
  setNavState: (navState) => set(() => ({ navState })),
  setCodeFiles: (codeFiles) => set(() => ({ codeFiles })),
  setCurrentCode: (fileName, code) =>
    set(() => ({ currentCode: { fileName, code } })),
  setIsTimerRunning: (isTimerRunning) => set(() => ({ isTimerRunning })),
  setIsFetchingChallenge: (isFetchingChallenge) =>
    set(() => ({ isFetchingChallenge })),
}));
