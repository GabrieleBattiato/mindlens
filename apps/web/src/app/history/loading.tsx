import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-44 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-4 w-64 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
