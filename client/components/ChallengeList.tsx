"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Framework = "react" | "vue" | "svelte" | "angular";

interface ChallengeList {
  [key: string]: {
    [key in Framework]: {
      code: string;
      instructions: string;
    }[];
  };
}

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
            <div className="flex h-12 w-96 items-center gap-1 rounded-md bg-white text-black">
              <h1>{challenge.split("-")[0]}</h1>
              <h1>{challenge.split("-")[1]}</h1>
              {Object.keys(challenges[challenge]).map((framework) => {
                return (
                  <Link
                    className="h-10 w-10 rounded-md bg-blue-500"
                    href={`/challenge/${challenge}/${framework}`}
                  ></Link>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
