"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { checkModelHealth } from "@/lib/api";
import type { ModelHealth } from "@/lib/api";

type HealthState = "checking" | "ok" | "error";

interface ModelHealthContextValue {
  healthState: HealthState;
  health: ModelHealth | null;
  recheck: () => Promise<void>;
}

const ModelHealthContext = createContext<ModelHealthContextValue | null>(null);

export function ModelHealthProvider({ children }: { children: React.ReactNode }) {
  const [healthState, setHealthState] = useState<HealthState>("checking");
  const [health, setHealth] = useState<ModelHealth | null>(null);
  const runningRef = useRef(false);

  const recheck = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setHealthState("checking");
    try {
      const result = await checkModelHealth();
      setHealth(result);
      setHealthState(result.ok ? "ok" : "error");
    } catch {
      setHealth(null);
      setHealthState("error");
    } finally {
      runningRef.current = false;
    }
  }, []);

  useEffect(() => {
    recheck();
  }, [recheck]);

  return (
    <ModelHealthContext.Provider value={{ healthState, health, recheck }}>
      {children}
    </ModelHealthContext.Provider>
  );
}

export function useModelHealth() {
  const ctx = useContext(ModelHealthContext);
  if (!ctx) throw new Error("useModelHealth must be used within ModelHealthProvider");
  return ctx;
}
