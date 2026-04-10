"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAnalysis, createAnalysis, cancelAnalysis } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { formatLabel } from "@/lib/distortion-labels";
import type { AnalysisResponse, LLMAnalysisResult } from "@/lib/types";
import type { TranslationKey, Locale } from "@/lib/i18n";

type TFn = (key: TranslationKey) => string;

// ─── Utilities ───────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
      {children}
    </h2>
  );
}

const EMOTION_GRADIENTS = [
  "from-blue-500 to-cyan-400", "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400", "from-amber-500 to-orange-400",
  "from-rose-500 to-red-400", "from-indigo-500 to-violet-400",
];

// ─── 1. INSIGHT HERO ─────────────────────────────────────────────────────────

function InsightHero({ result, t, locale }: { result: LLMAnalysisResult; t: TFn; locale: Locale }) {
  return (
    <section className="space-y-4">
      <div className="glass-card relative overflow-hidden p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-14 h-64 w-64 rounded-full bg-gradient-to-br from-white/[0.04] to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-white/[0.03] to-transparent blur-2xl" />

        <SectionTitle>{t("result.summary")}</SectionTitle>
        <p className="mt-4 text-[16px] leading-[1.8] text-zinc-200">{result.summary}</p>

        {/* Pattern chips */}
        {result.pattern_hints.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {result.pattern_hints.map((hint, i) => (
              <span
                key={i}
                className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-zinc-400"
              >
                {formatLabel(hint, locale)}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 2. CORE INSIGHTS (Emotions + Distortions + Reframe) ─────────────────────

function EmotionsSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  if (result.emotions.length === 0) return null;
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-zinc-100">{t("result.emotions")}</h3>
      <div className="mt-4 space-y-3">
        {result.emotions.map((e, i) => {
          const gradient = EMOTION_GRADIENTS[e.name.length % EMOTION_GRADIENTS.length];
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${e.is_primary ? "font-medium text-zinc-200" : "text-zinc-400"}`}>
                  {e.name}
                  {e.is_primary && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      {t("result.primary")}
                    </span>
                  )}
                </span>
                <span className="text-xs tabular-nums text-zinc-500">{e.intensity}/10</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                  style={{ width: `${e.intensity * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DistortionsSection({ result, t, locale }: { result: LLMAnalysisResult; t: TFn; locale: Locale }) {
  if (result.cognitive_distortions.length === 0) return null;
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-zinc-100">{t("result.distortions")}</h3>
      <div className="mt-4 space-y-4">
        {result.cognitive_distortions.map((d, i) => {
          const pct = Math.round(d.confidence * 100);
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">{formatLabel(d.name, locale)}</span>
                <span className="text-[10px] tabular-nums text-zinc-500">{pct}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[13px] leading-relaxed text-zinc-500">{d.evidence}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReframeSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-teal-500/5" />

      <div className="relative space-y-6">
        <SectionTitle>
          <span className="text-emerald-500">{t("result.reframe")}</span>
        </SectionTitle>

        {/* Old thought → New perspective */}
        <div className="space-y-5">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {t("result.oldThought")}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-through decoration-zinc-700">
              {result.abc_model.belief}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <span className="text-xs text-emerald-500/60">&darr;</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500/70">
              {t("result.newPerspective")}
            </span>
            <p className="mt-2 text-[16px] font-medium leading-relaxed text-emerald-200/90">
              {result.reframe.alternative_thought}
            </p>
          </div>
        </div>

        {/* Reasoning */}
        <div className="rounded-xl bg-white/[0.03] px-4 py-3">
          <p className="text-sm leading-relaxed text-zinc-400">
            {result.reframe.reasoning}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 3. COGNITIVE FLOW (A → B → C) ──────────────────────────────────────────

function CognitiveFlowSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  const steps = [
    { label: t("result.trigger"), value: result.abc_model.activating_event, color: "bg-blue-500", textColor: "text-blue-400" },
    { label: t("result.automaticThought"), value: result.abc_model.belief, color: "bg-violet-500", textColor: "text-violet-400" },
    { label: t("result.emotionalResult"), value: result.abc_model.consequence, color: "bg-rose-500", textColor: "text-rose-400" },
  ];

  return (
    <section className="space-y-4">
      <SectionTitle>{t("result.cognitiveProcess")}</SectionTitle>

      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-[11px] top-[40px] bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
            )}

            <div className="flex gap-4 pb-6">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={`h-[23px] w-[23px] shrink-0 rounded-full ${step.color}/20 flex items-center justify-center`}>
                  <div className={`h-2 w-2 rounded-full ${step.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 -mt-0.5">
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${step.textColor}/70`}>
                  {step.label}
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{step.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 4. MAINTENANCE CYCLE ────────────────────────────────────────────────────

function MaintenanceSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  const mc = result.maintenance_cycle;
  if (!mc) return null;

  return (
    <section className="space-y-4">
      <SectionTitle>{t("result.whatKeepsItGoing")}</SectionTitle>

      <div className="glass-card p-5">
        <div className="flex items-start gap-3">
          <Badge variant="outline" className="shrink-0 border-rose-500/30 bg-rose-500/10 text-[10px] text-rose-300">
            {mc.cycle_type.replace(/_/g, " ")}
          </Badge>
          <p className="text-sm leading-relaxed text-zinc-300">{mc.description}</p>
        </div>
        {mc.maintaining_factors.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-white/5 pt-3">
            {mc.maintaining_factors.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-400">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />{f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ─── 5. SUGGESTED EXERCISE ───────────────────────────────────────────────────

function NextStepSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  const [showAll, setShowAll] = useState(false);

  if (result.cbt_exercises.length === 0) return null;

  const primary = result.cbt_exercises[0];
  const rest = result.cbt_exercises.slice(1);

  return (
    <section className="space-y-4">
      <SectionTitle>{t("result.suggestedExercise")}</SectionTitle>

      {/* Primary exercise */}
      <div className="glass-card relative overflow-hidden p-6">
        <span className="pointer-events-none absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-400 to-sky-500" />

        <div className="pl-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">{primary.title}</h3>
            <Badge variant="secondary" className="text-[10px] uppercase">{primary.type}</Badge>
          </div>
          <p className="mt-2 text-sm text-zinc-400">{primary.description}</p>
          {primary.steps.length > 0 && (
            <ol className="mt-4 space-y-2">
              {primary.steps.map((step, j) => (
                <li key={j} className="flex gap-2.5 text-sm text-zinc-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
                    {j + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Additional exercises (collapsible) */}
      {rest.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <span className="transition-transform duration-200" style={{ transform: showAll ? "rotate(90deg)" : "rotate(0)" }}>
              ▸
            </span>
            {showAll ? t("result.showLess") : `${t("result.moreExercises")} (${rest.length})`}
          </button>

          {showAll && (
            <div className="space-y-3">
              {rest.map((ex, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">{ex.title}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">{ex.type}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-zinc-400">{ex.description}</p>
                  {ex.steps.length > 0 && (
                    <ol className="mt-3 space-y-1.5">
                      {ex.steps.map((step, j) => (
                        <li key={j} className="flex gap-2 text-sm text-zinc-400">
                          <span className="text-[10px] tabular-nums text-zinc-600">{j + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── 6. DEEP DIVE (Collapsible) ─────────────────────────────────────────────

function DeepDiveSection({ result, t }: { result: LLMAnalysisResult; t: TFn }) {
  const [open, setOpen] = useState(false);

  const hasBeliefs = !!result.belief_analysis;

  if (!hasBeliefs) return null;

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <span className="transition-transform duration-200" style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}>
          ▸
        </span>
        {t("result.deeperAnalysis")}
      </button>

      {open && (
        <div className="space-y-5">
          {/* Belief Analysis */}
          {hasBeliefs && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-zinc-100">{t("result.beliefAnalysis")}</h3>
              <div className="mt-4 space-y-4">
                {result.belief_analysis!.core_belief && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("result.coreBelief")}</span>
                    <p className="mt-1 text-sm text-zinc-300">{result.belief_analysis!.core_belief}</p>
                  </div>
                )}
                {result.belief_analysis!.intermediate_rules.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("result.intermediateRules")}</span>
                    <ul className="mt-2 space-y-1.5">
                      {result.belief_analysis!.intermediate_rules.map((rule, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400" />{rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("result.evidenceFor")}</span>
                    <ul className="mt-2 space-y-1.5">
                      {result.belief_analysis!.evidence_for.map((e, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-400">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-500/50" />{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("result.evidenceAgainst")}</span>
                    <ul className="mt-2 space-y-1.5">
                      {result.belief_analysis!.evidence_against.map((e, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />{e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Clarification card ──────────────────────────────────────────────────────

function ClarificationCard({ questions, onReanalyze, t }: {
  questions: string[];
  onReanalyze: (ctx: string) => Promise<void>;
  t: TFn;
}) {
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    if (!context.trim()) return;
    setLoading(true);
    try { await onReanalyze(context.trim()); }
    finally { setLoading(false); }
  }
  return (
    <div className="glass-card relative overflow-hidden border border-amber-500/25 bg-amber-500/[4%] p-6">
      <span className="pointer-events-none absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-gradient-to-b from-amber-400 to-orange-500" />
      <div className="pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500">{t("result.clarification.title")}</p>
        <p className="mt-1 text-sm text-zinc-400">{t("result.clarification.subtitle")}</p>
        <ul className="mt-4 space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-zinc-300">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
              {q}
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder={t("result.clarification.placeholder")}
            className="min-h-28 resize-none border-white/5 bg-white/[3%] text-sm placeholder:text-zinc-600 focus-visible:border-amber-500/30 focus-visible:ring-amber-500/20"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              disabled={!context.trim() || loading}
              onClick={handleSubmit}
              className="h-10 rounded-xl border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:brightness-110 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("result.clarification.reanalyzing")}
                </span>
              ) : t("result.clarification.reanalyze")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Loading / Error states ──────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Skeleton className="h-9 w-64 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-4 w-48 rounded bg-white/5" />
      </div>
      <Skeleton className="h-40 rounded-2xl bg-white/5" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl bg-white/5" />
        <Skeleton className="h-32 rounded-2xl bg-white/5" />
      </div>
      <Skeleton className="h-48 rounded-2xl bg-white/5" />
    </div>
  );
}

const PROCESSING_KEYS = [
  "result.processing.0",
  "result.processing.1",
  "result.processing.2",
  "result.processing.3",
] as const;

function ProcessingSpinner({ t, onCancel }: { t: TFn; onCancel: () => void }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % PROCESSING_KEYS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card flex flex-col items-center justify-center p-14 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
      <p className="text-sm text-zinc-400 transition-opacity duration-300">
        {t(PROCESSING_KEYS[msgIdx])}
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="mt-6 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
      >
        {t("result.cancel")}
      </button>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AnalysisResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useI18n();

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReanalyze = useCallback(async (additionalContext: string) => {
    if (!analysis) return;
    const combined = `${analysis.raw_input}\n\n---\nContexto adicional:\n${additionalContext}`;
    const newAnalysis = await createAnalysis({ input_mode: "free", raw_input: combined, locale });
    router.push(`/analysis/${newAnalysis.id}`);
  }, [analysis, router, locale]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial fetch
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getAnalysis(id)
      .then((data) => {
        if (!cancelled) { setAnalysis(data); }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("result.failed"));
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  // Poll while processing
  useEffect(() => {
    if (!analysis || (analysis.status !== "processing" && analysis.status !== "pending")) {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }

    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    pollRef.current = setInterval(async () => {
      try {
        const updated = await getAnalysis(analysis.id);
        setAnalysis(updated);
        if (updated.status !== "processing" && updated.status !== "pending") {
          if (pollRef.current) clearInterval(pollRef.current);
          if (document.hidden && updated.status === "completed") {
            new Notification("MindLens", { body: t("result.ready") });
          }
        }
      } catch { /* ignore poll errors */ }
    }, 3000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [analysis?.id, analysis?.status]);

  if (loading) return <LoadingSkeleton />;

  if (error || !analysis) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold"><span className="gradient-text">{t("result.title")}</span></h1>
        <div className="glass-card border-l-4 border-l-red-500/60 p-6">
          <p className="text-sm text-red-400">{error ?? t("result.failed")}</p>
        </div>
      </div>
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text">{t("result.title")}</span></h1>
          <p className="mt-2 text-sm text-zinc-400">{formatDate(analysis.created_at)}</p>
        </div>
        <div className="glass-card border-l-4 border-l-red-500/60 p-6">
          <p className="text-sm font-semibold text-red-400">{t("result.failed")}</p>
          <p className="mt-1 text-sm text-zinc-400">{analysis.error_message ?? t("result.failed")}</p>
        </div>
      </div>
    );
  }

  if (analysis.status === "pending" || analysis.status === "processing") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text">{t("result.title")}</span></h1>
          <p className="mt-2 text-sm text-zinc-400">{formatDate(analysis.created_at)}</p>
        </div>
        <ProcessingSpinner
          t={t}
          onCancel={async () => {
            await cancelAnalysis(analysis.id);
            router.push("/history");
          }}
        />
      </div>
    );
  }


  const result = analysis.result_json;
  if (!result) return null;

  // Clarification mode — show only the clarification card
  if (result.needs_clarification && (result.clarification_questions?.length ?? 0) > 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text">{t("result.title")}</span></h1>
          <p className="mt-2 text-sm text-zinc-400">{formatDate(analysis.created_at)}</p>
        </div>
        <ClarificationCard
          questions={result.clarification_questions!}
          onReanalyze={handleReanalyze}
          t={t}
        />
      </div>
    );
  }

  // ─── Full result view ────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-3xl space-y-16 pb-16">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">{t("result.title")}</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{formatDate(analysis.created_at)}</p>
      </div>

      {/* 1. Insight Hero */}
      <InsightHero result={result} t={t} locale={locale} />

      {/* 2. Core Insights: Emotions + Distortions side by side, then Reframe full width */}
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <EmotionsSection result={result} t={t} />
          <DistortionsSection result={result} t={t} locale={locale} />
        </div>
        <ReframeSection result={result} t={t} />
      </div>

      {/* 3. Cognitive Flow */}
      <CognitiveFlowSection result={result} t={t} />

      {/* 4. Maintenance */}
      <MaintenanceSection result={result} t={t} />

      {/* 5. Suggested Exercise */}
      <NextStepSection result={result} t={t} />

      {/* 6. Deep Dive */}
      <DeepDiveSection result={result} t={t} />
    </div>
  );
}
