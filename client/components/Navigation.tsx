import { useClickOutside } from "@/app/hooks";
import { useStore } from "@/app/store";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function Navigation() {
  const { navState, setNavState } = useStore();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(navRef, setNavState, [menuButtonRef]);

  return (
    <>
      <div className="absolute left-0 top-0 z-30 w-0 lg:hidden">
        <button
          className={`${
            navState === "CLOSED" ? "opacity-100" : "opacity-0"
          } absolute left-2 top-2 h-9 w-9 rounded-md border border-zinc-600 transition-all hover:bg-gradient-to-br hover:from-sky-900/50 hover:to-sky-900/20`}
          onClick={() => setNavState("OPEN")}
          ref={menuButtonRef}
        >
          <Menu className="h-full w-full text-zinc-600" strokeWidth={0.75} />
        </button>

        <div
          className={`${
            navState === "OPEN"
              ? "translate-x-0 shadow-custom shadow-black/80"
              : "-translate-x-full"
          } relative z-20 flex h-screen w-[80vw] flex-col border-r-2 border-zinc-600 bg-zinc-950 transition delay-100 ease-in-out lg:w-[60vw]`}
          ref={navRef}
        >
          <button
            className="absolute left-2 top-2 z-30 h-9 w-9 rounded-md border border-zinc-600 transition-all hover:bg-zinc-900"
            onClick={() => setNavState("CLOSED")}
          >
            <X className="h-full w-full text-zinc-600" strokeWidth={0.75} />
          </button>

          <div className="mx-auto mt-14 flex w-11/12 flex-grow select-none flex-col lg:mt-4"></div>
        </div>
      </div>
      <div className="hidden h-14 w-full flex-row border-b border-zinc-600 bg-zinc-925 lg:flex">
        <Link
          className="my-auto ml-2 flex h-4/5 w-36 items-center justify-center rounded-md transition-all hover:border hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20"
          href="/"
        >
          <h1 className="">
            Frame
            <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text font-extrabold text-transparent">
              Worked
            </span>
          </h1>
        </Link>
      </div>
    </>
  );
}
