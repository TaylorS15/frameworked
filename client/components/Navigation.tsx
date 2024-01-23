import { useClickOutside } from "@/app/hooks";
import { useStore } from "@/app/store";
import { Menu, X } from "lucide-react";
import { useRef } from "react";

export default function Navigation() {
  const { navState, setNavState } = useStore();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(navRef, setNavState, [menuButtonRef]);

  return (
    <div className="absolute left-0 top-0 w-0">
      <button
        className={`${
          navState === "CLOSED" ? "opacity-100" : "opacity-0"
        } absolute left-2 top-2 h-9 w-9 rounded-md border border-teal-600 transition-all hover:bg-teal-950`}
        onClick={() => setNavState("OPEN")}
        ref={menuButtonRef}
      >
        <Menu className="h-full w-full text-teal-600" strokeWidth={0.7} />
      </button>

      <div
        className={`${
          navState === "OPEN"
            ? "translate-x-0 shadow-custom shadow-black/80"
            : "-translate-x-full"
        } relative z-20 flex h-screen w-[80vw] flex-col border-r-2 border-teal-950 bg-teal-1000 transition delay-100 ease-in-out lg:w-[60vw]`}
        ref={navRef}
      >
        <button
          className="absolute left-2 top-2 z-30 h-9 w-9 rounded-md border border-teal-600 transition-all hover:bg-teal-950"
          onClick={() => setNavState("CLOSED")}
        >
          <X className="h-full w-full text-teal-600" strokeWidth={0.7} />
        </button>

        <div className="mx-auto mt-14 flex w-11/12 flex-grow select-none flex-col lg:mt-4"></div>
      </div>
    </div>
  );
}
