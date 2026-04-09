import { Skeleton } from "@/components/ui/skeleton";

export default function AnalysisLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-72 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-5 w-56 rounded-lg bg-white/5" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass-card p-6"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Skeleton className="h-5 w-40 rounded bg-white/5" />
            <Skeleton className="mt-4 h-4 w-full rounded bg-white/5" />
            <Skeleton className="mt-2 h-4 w-5/6 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
