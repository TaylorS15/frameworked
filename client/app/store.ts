import { create } from "zustand";

interface AppState {
  challengeFiles: {
    [fileName: string]: string;
  };
  currentCode: {
    fileName: string;
    code: string;
  };
  isTimerRunning: boolean;

  setChallengeFiles: (challengeFiles: { [key: string]: string }) => void;
  setCurrentCode: (fileName: string, code: string) => void;
  setIsTimerRunning: (isRunning: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
  challengeFiles: {},
  currentCode: {
    fileName: "",
    code: "",
  },
  isTimerRunning: false,
  setChallengeFiles: (challengeFiles) => set(() => ({ challengeFiles })),
  setCurrentCode: (fileName, code) => set(() => ({ currentCode: { fileName, code } })),
  setIsTimerRunning: (isTimerRunning) => set(() => ({ isTimerRunning })),
}));
