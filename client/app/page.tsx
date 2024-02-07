import ChallengeList from "@/components/ChallengeList";
import { SignUpButton, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Balancer from "react-wrap-balancer";

export default async function Home() {
  return (
    <main className="max-w-screen flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-blue-950/50 from-0% to-zinc-950 to-30%">
      <div className="absolute right-4 top-4">
        <UserButton />
      </div>

      <div className="mt-24 flex flex-col gap-8">
        <h1 className="mx-auto bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-5xl text-transparent sm:text-6xl md:text-7xl">
          Frame
          <span className="bg-gradient-to-br from-sky-300 to-sky-600 bg-clip-text font-semibold text-transparent">
            Worked
          </span>
        </h1>

        <p className="mx-auto w-5/6 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-center text-xl font-semibold text-transparent">
          <Balancer>
            Test your ability to answer relevant and challenging frontend
            interview questions.
          </Balancer>
        </p>

        <SignedOut>
          <SignUpButton>
            <button className="mx-auto flex h-12 w-40 items-center justify-center gap-2 rounded-full border border-sky-900 bg-sky-700 font-semibold transition-all hover:gap-3 hover:bg-sky-600">
              <p>Get started</p>
              <ChevronRight className="inline-block" strokeWidth={1.5} />
            </button>
          </SignUpButton>
        </SignedOut>
      </div>

      <ChallengeList className="mb-24 mt-24 h-[28rem] w-4/5 overflow-y-scroll rounded-md border border-zinc-600 lg:w-[42rem]" />
    </main>
  );
}
