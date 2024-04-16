"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ChallengeItemsList } from "@/app/types";
import * as api from "@/app/api";
import { cn } from "@/lib/utils";
import ReactIcon from "@/public/react.svg";
import SvelteIcon from "@/public/svelte.svg";
import VueIcon from "@/public/vue.svg";
import AngularIcon from "@/public/angular.svg";

export default function ChallengeList({ className }: { className?: string }) {
  const { data } = useQuery({
    queryKey: ["challengeList"],
    queryFn: async (): Promise<ChallengeItemsList> => await api.fetchChallengeList(),
  });

  return (
    <div className={cn("flex flex-col items-center bg-zinc-925", className)}>
      {data &&
        Object.keys(data).map((challenge) => {
          return <ChallengeItem key={challenge} challenge={challenge} />;
        })}
    </div>
  );
}

function ChallengeItem({ challenge }: { challenge: string }) {
  const { data } = useQuery({
    queryKey: ["challengeData", challenge],
    queryFn: async () => await api.fetchChallengeData(challenge),
  });

  return (
    <>
      {data && (
        <Link
          href={`/challenge/${challenge}/${Object.keys(data.frameworks)[0]}`}
          className="flex h-16 min-h-16 w-full items-center justify-between border border-zinc-700 bg-zinc-950 pl-4 pr-2 transition-all hover:bg-gradient-to-br hover:from-zinc-900/50 hover:to-zinc-900/10"
        >
          <div className="flex gap-4">
            <h1 className="text-sm leading-6 text-zinc-400">{challenge.split("-")[0]}</h1>
            <h1>{challenge.split("-")[1]}</h1>
          </div>

          <div className="flex gap-4 pr-2">
            <p
              className={`${
                data.difficulty === "easy"
                  ? "text-green-400"
                  : data.difficulty === "medium"
                    ? "text-yellow-500"
                    : "text-red-700"
              } my-auto text-xs`}
            >
              {data.difficulty}
            </p>

            {Object.keys(data.frameworks).map((framework) => {
              return (
                <Link
                  className="flex"
                  href={`/challenge/${challenge}/${framework}`}
                  key={framework}
                >
                  {framework === "react" && (
                    <Image
                      alt="react icon"
                      src={ReactIcon}
                      className="m-auto h-6 w-6 transition-all hover:h-7 hover:w-7"
                    />
                  )}
                  {framework === "svelte" && (
                    <Image
                      alt="svelte icon"
                      src={SvelteIcon}
                      className="m-auto h-6 w-6 transition-all hover:h-7 hover:w-7"
                    />
                  )}
                  {framework === "vue" && (
                    <Image
                      alt="vue icon"
                      src={VueIcon}
                      className="m-auto h-6 w-6 transition-all hover:h-7 hover:w-7"
                    />
                  )}
                  {framework === "angular" && (
                    <Image
                      alt="angular icon"
                      src={AngularIcon}
                      className="m-auto h-6 w-6 transition-all hover:h-7 hover:w-7"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </Link>
      )}
    </>
  );
}
