import { ChallengeList, Framework } from "@/app/types";

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

  return challengeList;
}

export async function fetchChallengeData(challenge: string) {
  const challengeList = await fetchChallengeList();
  const challengeData = challengeList[challenge];

  return {
    challengeData: challengeData.frameworks,
    difficulty: challengeData.difficulty,
  };
}
