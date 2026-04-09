import { Skeleton } from "@/components/ui/skeleton";

export default function NewAnalysisLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Skeleton className="h-10 w-52 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-4 w-72 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-2xl bg-white/5" />
        <Skeleton className="h-24 rounded-2xl bg-white/5" />
      </div>
      <Skeleton className="h-56 rounded-2xl bg-white/5" />
    </div>
  );
}
