import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex h-screen w-full flex-col justify-between lg:flex-row">
      <div className="h-[31vh] p-2 lg:h-full lg:flex-grow lg:pt-14">
        <div className="flex h-full flex-col gap-2 border border-zinc-800 p-2">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="mt-24 hidden h-12 w-full lg:block" />
          <Skeleton className="hidden h-48 w-full lg:block" />
          <Skeleton className="mt-36 hidden h-12 w-full lg:block" />
          <Skeleton className="hidden h-36 w-full lg:block" />
          <Skeleton className="hidden h-36 w-full lg:block" />
          <Skeleton className="hidden h-36 w-full lg:block" />
        </div>
      </div>
      <div className="h-[31vh] border border-zinc-800 p-2 lg:h-full lg:flex-grow">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="h-[31vh] border border-zinc-800 p-2 lg:h-full lg:flex-grow">
        <Skeleton className="h-full w-full" />
      </div>
    </main>
  );
}
