export type Framework = "react" | "vue" | "angular" | "svelte";

export type Challenge = {
  frameworks: {
    [key in Framework]: {
      code: {
        [key: string]: string;
      };
      instructions: string;
    };
  };
  difficulty: "easy" | "medium" | "hard";
};

export type ChallengeList = {
  [key: string]: Challenge;
};
