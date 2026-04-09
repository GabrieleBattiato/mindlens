"use client";

import { useModelHealth } from "@/lib/model-health-context";

export function ModelHealthIndicator() {
  const { healthState, health } = useModelHealth();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {healthState === "checking" && (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-[11px] text-zinc-500 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-500 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-500" />
          </span>
          Checking model...
        </div>
      )}

      {healthState === "ok" && health && (
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-zinc-900/80 px-3 py-1.5 text-[11px] text-zinc-400 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-emerald-400/80">{health.model}</span>
        </div>
      )}

      {healthState === "error" && (
        <div className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-zinc-900/80 px-3 py-1.5 text-[11px] text-amber-400/80 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
          </span>
          {health?.error === "model_not_found" ? `Model not found: ${health.model}` : "Ollama not running"}
        </div>
      )}
    </div>
  );
}
