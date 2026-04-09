import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-64 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-4 w-80 rounded-lg bg-white/5" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-xl bg-white/5" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl bg-white/5" />
    </div>
  );
}
