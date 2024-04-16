import Link from "next/link";

export default function Navigation() {
  return (
    <>
      <div className="absolute left-0 top-0 z-30 w-0 lg:hidden">
        <Link
          className="absolute m-2 flex h-10 w-36 items-center justify-center rounded-md border transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20"
          href="/"
        >
          <h1>
            Frame
            <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text font-extrabold text-transparent">
              Worked
            </span>
          </h1>
        </Link>
      </div>
      <div className="hidden h-14 w-full flex-row border-b border-zinc-600 bg-zinc-925 lg:flex">
        <Link
          className="my-auto ml-2 flex h-4/5 w-36 items-center justify-center rounded-md transition-all hover:border hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20"
          href="/"
        >
          <h1>
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
