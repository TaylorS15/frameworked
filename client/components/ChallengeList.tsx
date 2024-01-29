"use client";
import Link from "next/link";
import ReactIcon from "@/public/react.svg";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ChallengeList } from "@/app/types";
import * as api from "@/app/api";

export default function ChallengeList() {
  const { data } = useQuery({
    queryKey: ["challengeList"],
    queryFn: async (): Promise<ChallengeList> => await api.fetchChallengeList(),
  });

  return (
    <div className="flex flex-col gap-4">
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
        <div className="flex h-12 w-96 items-center justify-between rounded-md border border-zinc-900 pl-4 pr-1 transition hover:bg-zinc-900/30">
          <div className="flex gap-4">
            <h1>{challenge.split("-")[0]}.</h1>
            <h1>{challenge.split("-")[1]}</h1>
          </div>
          <div className="flex gap-4">
            <p
              className={`${
                data.difficulty === "easy"
                  ? "text-green-400"
                  : data.difficulty === "medium"
                    ? "text-yellow-500"
                    : "text-red-700"
              } my-auto`}
            >
              {data.difficulty}
            </p>
            {Object.keys(data.frameworks).map((framework) => {
              return (
                <Link
                  className="h-10 w-10 rounded-md bg-zinc-900 p-[0.1rem] transition-all duration-200 hover:p-0"
                  href={`/challenge/${challenge}/${framework}`}
                  key={framework}
                >
                  <Image
                    alt="react icon"
                    src={ReactIcon}
                    className="transition-all duration-500 hover:rotate-90"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
