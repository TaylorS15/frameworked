"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactIcon from "@/public/react.svg";
import Image from "next/image";

type Framework = "react" | "vue" | "angular" | "svelte";
type Challenge = {
  frameworks: {
    [key in Framework]?: {
      code: string;
      instructions: string;
    }[];
  };
  difficulty: string;
};
type ChallengeList = {
  [key: string]: Challenge;
};

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<ChallengeList>();

  useEffect(() => {
    fetch("/challenges-map.json/")
      .then((res) => res.json())
      .then((json) => setChallenges(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {challenges &&
        Object.keys(challenges).map((challenge) => {
          return (
            <div className="flex h-12 w-96 items-center justify-between rounded-md border border-teal-950 pl-4 pr-1 transition hover:bg-teal-950/30">
              <div className="flex gap-4">
                <h1>{challenge.split("-")[0]}.</h1>
                <h1>{challenge.split("-")[1]}</h1>
              </div>
              <div className="flex gap-4">
                <p
                  className={`${
                    challenges[challenge].difficulty === "easy"
                      ? "text-green-400"
                      : challenges[challenge].difficulty === "medium"
                        ? "text-yellow-500"
                        : "text-red-700"
                  } my-auto`}
                >
                  {challenges[challenge].difficulty}
                </p>
                {Object.keys(challenges[challenge].frameworks).map(
                  (framework) => {
                    return (
                      <Link
                        className="h-10 w-10 rounded-md bg-teal-950 p-[0.1rem] transition-all duration-200 hover:p-0"
                        href={`/challenge/${challenge}/${framework}`}
                      >
                        <Image alt="react icon" src={ReactIcon} />
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
