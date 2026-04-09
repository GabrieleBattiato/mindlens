"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { createAnalysis } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useModelHealth } from "@/lib/model-health-context";

export default function NewAnalysisPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { healthState, health, recheck } = useModelHealth();

  useEffect(() => {
    recheck();
  }, [recheck]);

  const [situation, setSituation] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [emotions, setEmotions] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [behaviors, setBehaviors] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!situation.trim() || !thoughts.trim() || !emotions.trim()) return;
    setLoading(true);
    try {
      const analysis = await createAnalysis({
        input_mode: "guided",
        situation: situation.trim(),
        thoughts: thoughts.trim(),
        emotions: emotions.trim(),
        intensity,
        behaviors: behaviors.trim() || undefined,
      });
      router.push(`/analysis/${analysis.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("analysis.new.error"));
    } finally {
      setLoading(false);
    }
  }

  const modelBlocked = healthState === "checking" || healthState === "error";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">{t("analysis.new.title")}</span>
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          {t("analysis.new.subtitle")}
        </p>
      </div>

      {/* Model health banner */}
      {healthState === "error" && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/[5%] px-4 py-4 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
            <div className="space-y-2">
              {health?.error === "model_not_found" ? (
                <>
                  <p className="font-medium text-amber-300">{t("analysis.new.modelNotFound")}</p>
                  <code className="block rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-amber-200/80">
                    ollama pull {health.model}
                  </code>
                </>
              ) : (
                <>
                  <p className="font-medium text-amber-300">{t("analysis.new.ollamaUnreachable")}</p>
                  <code className="block rounded-lg bg-black/40 px-3 py-2 font-mono text-xs text-amber-200/80">
                    ollama serve
                  </code>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Situation */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-400">1</span>
            <Label htmlFor="situation" className="text-sm font-medium text-zinc-200">{t("analysis.new.situation")}</Label>
          </div>
          <Textarea
            id="situation"
            placeholder={t("analysis.new.situationPlaceholder")}
            className="min-h-24 resize-none border-white/5 bg-white/[3%] text-sm leading-relaxed placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
        </div>

        {/* Thoughts */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-400">2</span>
            <Label htmlFor="thoughts" className="text-sm font-medium text-zinc-200">{t("analysis.new.thoughts")}</Label>
          </div>
          <Textarea
            id="thoughts"
            placeholder={t("analysis.new.thoughtsPlaceholder")}
            className="min-h-24 resize-none border-white/5 bg-white/[3%] text-sm leading-relaxed placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
          />
        </div>

        {/* Emotions */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-400">3</span>
            <Label htmlFor="emotions" className="text-sm font-medium text-zinc-200">{t("analysis.new.emotions")}</Label>
          </div>
          <Input
            id="emotions"
            placeholder={t("analysis.new.emotionsPlaceholder")}
            className="border-white/5 bg-white/[3%] text-sm placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
            value={emotions}
            onChange={(e) => setEmotions(e.target.value)}
          />
        </div>

        {/* Intensity */}
        <div className="glass-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-400">4</span>
            <Label className="text-sm font-medium text-zinc-200">{t("analysis.new.intensity")}</Label>
            <span className="ml-auto text-3xl font-bold tabular-nums gradient-text">{intensity}</span>
            <span className="text-sm text-zinc-500">/10</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[intensity]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val;
              setIntensity(v);
            }}
          />
        </div>

        {/* Behaviors */}
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-500">5</span>
            <Label htmlFor="behaviors" className="text-sm font-medium text-zinc-200">{t("analysis.new.behaviors")}</Label>
            <span className="text-xs text-zinc-500">{t("analysis.new.optional")}</span>
          </div>
          <Textarea
            id="behaviors"
            placeholder={t("analysis.new.behaviorsPlaceholder")}
            className="min-h-20 resize-none border-white/5 bg-white/[3%] text-sm leading-relaxed placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
            value={behaviors}
            onChange={(e) => setBehaviors(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            className="h-11 min-w-[160px] rounded-xl border-0 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
            disabled={!situation.trim() || !thoughts.trim() || !emotions.trim() || loading || modelBlocked}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("analysis.new.analyzing")}
              </span>
            ) : (
              t("analysis.new.analyze")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
