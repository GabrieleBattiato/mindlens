import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div>
        <Skeleton className="h-12 w-72 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-5 w-96 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-44 rounded-2xl bg-white/5" />
        <Skeleton className="h-44 rounded-2xl bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}
