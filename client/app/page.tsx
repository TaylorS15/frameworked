import ChallengeList from "@/components/ChallengeList";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <UserButton />
      <h1>Framework Challenge</h1>
      <ChallengeList />
    </main>
  );
}
