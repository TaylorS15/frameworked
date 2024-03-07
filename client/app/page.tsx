import ChallengeList from "@/components/ChallengeList";
import Balancer from "react-wrap-balancer";

export default async function Home() {
  return (
    <main className="max-w-screen flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-blue-950/50 from-0% to-zinc-950 to-30%">
      <div className="mt-24 flex flex-col gap-8">
        <h1 className="mx-auto bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-5xl text-transparent sm:text-6xl md:text-7xl">
          Frame
          <span className="bg-gradient-to-br from-sky-300 to-sky-600 bg-clip-text font-semibold text-transparent">
            Worked
          </span>
        </h1>

        <p className="mx-auto w-5/6 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-center text-xl font-semibold text-transparent">
          <Balancer>
            Test your ability to answer relevant and challenging frontend interview
            questions.
          </Balancer>
        </p>
      </div>

      <ChallengeList className="mb-24 mt-24 h-[28rem] w-4/5 overflow-y-scroll rounded-md border border-zinc-600 lg:w-[42rem]" />
    </main>
  );
}
