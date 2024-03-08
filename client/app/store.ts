import { create } from "zustand";

interface AppState {
  navState: "OPEN" | "CLOSED";
  challengeFiles: {
    [fileName: string]: string;
  };
  currentCode: {
    fileName: string;
    code: string;
  };
  isTimerRunning: boolean;
  isFetchingChallenge: boolean;
  setNavState: (navState: "OPEN" | "CLOSED") => void;
  setChallengeFiles: (challengeFiles: { [key: string]: string }) => void;
  setCurrentCode: (fileName: string, code: string) => void;
  setIsTimerRunning: (isRunning: boolean) => void;
  setIsFetchingChallenge: (isFetching: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  navState: "CLOSED",
  challengeFiles: {},
  currentCode: {
    fileName: "",
    code: "",
  },
  isTimerRunning: false,
  isFetchingChallenge: false,
  setNavState: (navState) => set(() => ({ navState })),
  setChallengeFiles: (challengeFiles) => set(() => ({ challengeFiles })),
  setCurrentCode: (fileName, code) => set(() => ({ currentCode: { fileName, code } })),
  setIsTimerRunning: (isTimerRunning) => set(() => ({ isTimerRunning })),
  setIsFetchingChallenge: (isFetchingChallenge) => set(() => ({ isFetchingChallenge })),
}));
