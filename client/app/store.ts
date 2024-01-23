import { create } from "zustand";

interface AppState {
  navState: "OPEN" | "CLOSED";
  setNavState: (navState: "OPEN" | "CLOSED") => void;
}

export const useStore = create<AppState>()((set) => ({
  navState: "CLOSED",
  setNavState: (navState) => set(() => ({ navState })),
}));
