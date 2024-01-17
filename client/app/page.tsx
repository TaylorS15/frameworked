import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <UserButton />
      <h1>Framework Challenge</h1>
      <Link href="/challenge">
        <button className="h-10 w-24 rounded-md bg-white text-black">
          Challenge 1
        </button>
      </Link>
    </main>
  );
}
