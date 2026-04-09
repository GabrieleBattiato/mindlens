import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ABCDEExerciseContent } from "./exercise-content";

export default function ABCDEExercisePage() {
  return (
    <Suspense
      fallback={
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
          <Skeleton className="h-1 w-full rounded-full bg-white/5" />
          <div className="glass-card p-8">
            <Skeleton className="h-14 w-14 rounded-2xl bg-white/5" />
            <Skeleton className="mt-4 h-6 w-48 rounded bg-white/5" />
            <Skeleton className="mt-2 h-4 w-72 rounded bg-white/5" />
            <Skeleton className="mt-6 h-40 w-full rounded-xl bg-white/5" />
          </div>
        </div>
      }
    >
      <ABCDEExerciseContent />
    </Suspense>
  );
}
