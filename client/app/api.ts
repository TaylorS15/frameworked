import { ChallengeList } from "@/app/types";
import { z } from "zod";

export async function transpileReact(code: string) {
  const response = await fetch("http://localhost:4000/transpileReact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code }),
  }).then((res) => res.json());

  return response.transpiledReact;
}

export async function fetchChallengeList() {
  const challengeList: ChallengeList = await fetch("/challenges-map.json/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  //Zod validation, probably not needed. Currently breaks all challenge links if one challenge's json is invalid
  // const Framework = z.union([
  //   z.literal("react"),
  //   z.literal("vue"),
  //   z.literal("angular"),
  //   z.literal("svelte"),
  // ]);

  // const Challenge = z.object({
  //   frameworks: z
  //     .record(
  //       z.object({
  //         code: z.string(),
  //         instructions: z.string(),
  //       }),
  //     )
  //     .refine(
  //       (value) =>
  //         Object.keys(value).every((key) => Framework.safeParse(key).success),
  //       {
  //         message: "Invalid framework",
  //       },
  //     ),
  //   difficulty: z.union([
  //     z.literal("easy"),
  //     z.literal("medium"),
  //     z.literal("hard"),
  //   ]),
  // });

  // const result = z.record(Challenge).safeParse(challengeList);

  // return result.success ? result.data : {};

  return challengeList;
}

export async function fetchChallengeData(challenge: string) {
  const challengeList = await fetchChallengeList();
  const challengeData = challengeList[challenge];

  return {
    frameworks: challengeData.frameworks,
    difficulty: challengeData.difficulty,
  };
}
