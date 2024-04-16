import { ChallengeItemsList } from "@/app/types";

export async function transpileReact(code: string, css: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE}/transpile-react`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, css }),
  }).then((res) => res.json());

  return response.transpiledReact;
}

export async function fetchChallengeList() {
  const challengeList: ChallengeItemsList = await fetch("/challenges-map.json/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

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
