import ChallengeList from "@/components/ChallengeList";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-8">
      <UserButton />
      <ChallengeList />
    </main>
  );
}
