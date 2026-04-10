"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { createExercise, getExercise, updateExercise, getAnalysis, getExerciseAssist, createAnalysis } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";
import type { AssistResponse } from "@/lib/types";

const STEP_COLORS = [
  { bg: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/10" },
  { bg: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", text: "text-violet-400", glow: "shadow-violet-500/10" },
  { bg: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/10" },
  { bg: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/10" },
  { bg: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
  { bg: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/10" },
];

type StepKey = "activating_event" | "belief" | "consequence" | "disputation" | "effective_new_belief" | "new_feeling";

interface Step {
  key: StepKey;
  letter: string;
  label: string;
  description: string;
  placeholder: string;
  hints: string[];
  hintsLabel: TranslationKey;
  info: string;
}

function buildSteps(t: (key: TranslationKey) => string): Step[] {
  return [
    {
      key: "activating_event",
      letter: "A",
      label: t("exercise.a.label"),
      description: t("exercise.a.desc"),
      placeholder: t("exercise.a.placeholder"),
      hints: [],
      hintsLabel: "exercise.hints",
      info: t("info.exercise.a"),
    },
    {
      key: "belief",
      letter: "B",
      label: t("exercise.b.label"),
      description: t("exercise.b.desc"),
      placeholder: t("exercise.b.placeholder"),
      hints: [],
      hintsLabel: "exercise.hints",
      info: t("info.exercise.b"),
    },
    {
      key: "consequence",
      letter: "C",
      label: t("exercise.c.label"),
      description: t("exercise.c.desc"),
      placeholder: t("exercise.c.placeholder"),
      hints: [],
      hintsLabel: "exercise.hints",
      info: t("info.exercise.c"),
    },
    {
      key: "disputation",
      letter: "D",
      label: t("exercise.d.label"),
      description: t("exercise.d.desc"),
      placeholder: t("exercise.d.placeholder"),
      info: t("info.exercise.d"),
      hintsLabel: "exercise.hints",
      hints: [
        t("exercise.hint.d1"),
        t("exercise.hint.d2"),
        t("exercise.hint.d3"),
        t("exercise.hint.d4"),
        t("exercise.hint.d5"),
        t("exercise.hint.d6"),
        t("exercise.hint.d7"),
        t("exercise.hint.d8"),
        t("exercise.hint.d9"),
        t("exercise.hint.d10"),
      ],
    },
    {
      key: "effective_new_belief",
      letter: "E",
      label: t("exercise.e.label"),
      description: t("exercise.e.desc"),
      placeholder: t("exercise.e.placeholder"),
      info: t("info.exercise.e"),
      hintsLabel: "exercise.hints.starters",
      hints: [
        t("exercise.hint.e1"),
        t("exercise.hint.e2"),
        t("exercise.hint.e3"),
        t("exercise.hint.e4"),
      ],
    },
    {
      key: "new_feeling",
      letter: "F",
      label: t("exercise.f.label"),
      description: t("exercise.f.desc"),
      placeholder: t("exercise.f.placeholder"),
      hints: [],
      hintsLabel: "exercise.hints",
      info: t("info.exercise.f"),
    },
  ];
}

const HELP_STEPS = [
  { letter: "A", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", descKey: "exercise.help.a", exKey: "exercise.help.a.example" },
  { letter: "B", color: "text-violet-400", bg: "bg-violet-500/15", border: "border-violet-500/30", descKey: "exercise.help.b", exKey: "exercise.help.b.example" },
  { letter: "C", color: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30", descKey: "exercise.help.c", exKey: "exercise.help.c.example" },
  { letter: "D", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", descKey: "exercise.help.d", exKey: "exercise.help.d.example" },
  { letter: "E", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", descKey: "exercise.help.e", exKey: "exercise.help.e.example" },
  { letter: "F", color: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", descKey: "exercise.help.f", exKey: "exercise.help.f.example" },
] as const;

function HelpModal({ t, onClose }: { t: (key: TranslationKey) => string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-100">{t("exercise.help.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/8 hover:text-zinc-300"
          >
            &times;
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {t("exercise.help.intro")}
        </p>

        <div className="mt-5 space-y-4">
          {HELP_STEPS.map((s) => (
            <div key={s.letter} className="flex gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.bg} border ${s.border} text-sm font-bold ${s.color}`}>
                {s.letter}
              </span>
              <div className="flex-1 space-y-1.5">
                <p className="text-sm text-zinc-300">{t(s.descKey as TranslationKey)}</p>
                <p className="rounded-lg bg-white/[3%] px-3 py-2 text-xs italic text-zinc-500">
                  &ldquo;{t(s.exKey as TranslationKey)}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ABCDEExerciseContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("analysisId");
  const exerciseId = searchParams.get("exerciseId");

  const STEPS = buildSteps(t);

  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<StepKey, string>>({
    activating_event: "",
    belief: "",
    consequence: "",
    disputation: "",
    effective_new_belief: "",
    new_feeling: "",
  });
  const [emotionEntries, setEmotionEntries] = useState<Array<{ name: string; intensity: number }>>([
    { name: "", intensity: 5 },
    { name: "", intensity: 5 },
    { name: "", intensity: 5 },
  ]);
  const [behaviorText, setBehaviorText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [assistLoading, setAssistLoading] = useState(false);
  const [assistResult, setAssistResult] = useState<AssistResponse | null>(null);
  const [assistError, setAssistError] = useState<string | null>(null);
  const [existingExerciseId, setExistingExerciseId] = useState<string | null>(exerciseId);
  const [linkedAnalysisId, setLinkedAnalysisId] = useState<string | null>(analysisId);

  // Load existing exercise (continue mode)
  useEffect(() => {
    if (!exerciseId) return;
    let cancelled = false;

    async function loadExercise() {
      try {
        const ex = await getExercise(exerciseId!);
        if (cancelled) return;
        setLinkedAnalysisId(ex.analysis_id);
        setValues({
          activating_event: ex.activating_event || "",
          belief: ex.belief || "",
          consequence: ex.consequence || "",
          disputation: ex.disputation || "",
          effective_new_belief: ex.effective_new_belief || "",
          new_feeling: ex.new_emotion || ex.new_behavior || "",
        });
        // Jump to the first empty step
        const keys: StepKey[] = ["activating_event", "belief", "consequence", "disputation", "effective_new_belief", "new_feeling"];
        const firstEmpty = keys.findIndex((k) => {
          const v = k === "activating_event" ? ex.activating_event :
                    k === "belief" ? ex.belief :
                    k === "consequence" ? ex.consequence :
                    k === "disputation" ? ex.disputation :
                    k === "effective_new_belief" ? ex.effective_new_belief :
                    ex.new_emotion || ex.new_behavior || "";
          return !v?.trim();
        });
        if (firstEmpty > 0) setCurrentStep(firstEmpty);
      } catch {
        // Best-effort
      }
    }

    loadExercise();
    return () => { cancelled = true; };
  }, [exerciseId]);

  // Pre-fill from analysis (new exercise mode)
  useEffect(() => {
    if (!analysisId || exerciseId) return;
    let cancelled = false;

    async function prefill() {
      try {
        const analysis = await getAnalysis(analysisId!);
        if (cancelled) return;
        if (analysis.result_json?.abc_model) {
          const abc = analysis.result_json.abc_model;
          setValues((prev) => ({
            ...prev,
            activating_event: abc.activating_event || prev.activating_event,
            belief: abc.belief || prev.belief,
            consequence: abc.consequence || prev.consequence,
          }));
        }
      } catch {
        // Pre-fill is best-effort
      }
    }

    prefill();
    return () => { cancelled = true; };
  }, [analysisId, exerciseId]);

  // Sync emotion entries + behavior to values.consequence
  useEffect(() => {
    const emotionParts = emotionEntries
      .filter((e) => e.name.trim())
      .map((e) => `${e.name.trim()} (${e.intensity}/10)`)
      .join(", ");
    const parts: string[] = [];
    if (emotionParts) parts.push(emotionParts);
    if (behaviorText.trim()) parts.push(behaviorText.trim());
    setValues((prev) => ({ ...prev, consequence: parts.join(". ") }));
  }, [emotionEntries, behaviorText]);

  function setValue(key: StepKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function goToStep(i: number) {
    setCurrentStep(i);
    setAssistResult(null);
    setAssistError(null);
  }

  async function handleAssist() {
    setAssistLoading(true);
    setAssistError(null);
    setAssistResult(null);
    try {
      const step = currentStep === 3 ? "disputation" as const : "new_belief" as const;
      const result = await getExerciseAssist({
        step,
        activating_event: values.activating_event,
        belief: values.belief,
        consequence: values.consequence,
        disputation: step === "new_belief" ? values.disputation : undefined,
      });
      setAssistResult(result);
    } catch {
      setAssistError(t("exercise.assist.error"));
    } finally {
      setAssistLoading(false);
    }
  }

  async function handleComplete() {
    setSubmitting(true);
    try {
      const data = {
        analysis_id: linkedAnalysisId ?? undefined,
        activating_event: values.activating_event.trim(),
        belief: values.belief.trim(),
        consequence: values.consequence.trim(),
        disputation: values.disputation.trim() || undefined,
        effective_new_belief: values.effective_new_belief.trim() || undefined,
        new_emotion: values.new_feeling.trim() || undefined,
        new_behavior: values.new_feeling.trim() || undefined,
      };

      if (existingExerciseId) {
        await updateExercise(existingExerciseId, { ...data, status: "completed" });
      } else {
        await createExercise(data);
      }

      // Synthesize ABCDE into raw_input and trigger analysis
      const parts = [
        `Evento activador (A): ${values.activating_event.trim()}`,
        `Creencia automática (B): ${values.belief.trim()}`,
        `Consecuencias (C): ${values.consequence.trim()}`,
        values.disputation.trim() ? `Disputa (D): ${values.disputation.trim()}` : null,
        values.effective_new_belief.trim() ? `Nueva creencia (E): ${values.effective_new_belief.trim()}` : null,
        values.new_feeling.trim() ? `Nuevo sentimiento (F): ${values.new_feeling.trim()}` : null,
      ].filter(Boolean).join("\n\n");

      const analysis = await createAnalysis({ input_mode: "free", raw_input: parts });
      router.push(`/analysis/${analysis.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("exercise.saveError")
      );
    } finally {
      setSubmitting(false);
    }
  }

  const step = STEPS[currentStep];
  const color = STEP_COLORS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">{t("exercise.title")}</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {t("exercise.subtitle")}
        </p>
      </div>

      {/* Step pills + help */}
      <div className="animate-fade-in-up stagger-2 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const c = STEP_COLORS[i];
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          const hasContent = values[s.key].trim().length > 0;

          return (
            <button
              key={s.key}
              onClick={() => goToStep(i)}
              disabled={submitting}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-40 ${
                isActive
                  ? `bg-gradient-to-br ${c.bg} ${c.border} border ${c.text} shadow-lg ${c.glow} scale-110`
                  : isDone || hasContent
                    ? `bg-white/5 border border-white/10 ${c.text} hover:bg-white/10`
                    : "bg-white/[3%] border border-white/5 text-zinc-600 hover:bg-white/5 hover:text-zinc-400"
              }`}
            >
              {s.letter}
              {(isDone || hasContent) && !isActive && (
                <span className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gradient-to-br ${c.bg.replace('/20', '/60')}`} />
              )}
            </button>
          );
        })}

        {/* Help button */}
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="ml-auto flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[3%] px-3 py-2 text-xs font-medium text-zinc-500 transition-all hover:bg-white/[6%] hover:text-zinc-300"
        >
          <span className="text-sm">?</span>
          {t("exercise.help")}
        </button>
      </div>

      {/* Help modal */}
      {helpOpen && <HelpModal t={t} onClose={() => setHelpOpen(false)} />}

      {/* Progress bar */}
      <div className="animate-fade-in-up stagger-2">
        <div className="h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          {t("exercise.step")} {currentStep + 1} {t("exercise.of")} {STEPS.length}
        </p>
      </div>

      {/* Current step card */}
      <div
        key={step.key}
        className="animate-scale-in space-y-3"
      >
        {/* Explanation above the card */}
        <p className="text-[13px] leading-relaxed text-zinc-500 px-1">
          {step.info}
        </p>

        <div className={`glass-card relative overflow-hidden p-8`}>
          {/* Gradient accent overlay */}
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${color.bg} opacity-30`} />
          <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${color.bg} blur-3xl opacity-40`} />

          <div className="relative space-y-5">
            {/* Step header */}
            <div className="flex items-center gap-4">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color.bg} border ${color.border} text-2xl font-bold ${color.text}`}>
                {step.letter}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  {step.label}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Step C: multi-emotion + intensity UI */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("exercise.c.behaviorLabel")}</p>
                  <Textarea
                    placeholder={t("exercise.c.behaviorPlaceholder")}
                    className="min-h-20 resize-none border-white/5 bg-white/[3%] text-sm placeholder:text-zinc-600 focus:border-white/10 focus:ring-1 focus:ring-indigo-500/30"
                    value={behaviorText}
                    onChange={(e) => setBehaviorText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {emotionEntries.map((entry, idx) => (
                    <div key={idx} className="space-y-2 rounded-lg border border-white/8 bg-white/[2%] p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={t("exercise.c.emotionPlaceholder")}
                          value={entry.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEmotionEntries((prev) => prev.map((em, i) => i === idx ? { ...em, name: val } : em));
                          }}
                          className="h-7 border-0 bg-transparent p-0 text-sm placeholder:text-zinc-600 focus-visible:ring-0"
                        />
                        <button
                          type="button"
                          className="shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors"
                          onClick={() => setEmotionEntries((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">{t("exercise.c.intensity")}</span>
                        <span className="text-xs font-semibold text-zinc-400">{entry.intensity}/10</span>
                      </div>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[entry.intensity]}
                        onValueChange={(vals) => {
                          const val = vals[0];
                          setEmotionEntries((prev) => prev.map((em, i) => i === idx ? { ...em, intensity: val } : em));
                        }}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  onClick={() => setEmotionEntries((prev) => [...prev, { name: "", intensity: 5 }])}
                >
                  + {t("exercise.c.addEmotion")}
                </button>
              </div>
            )}

            {/* Step E: original belief reference */}
            {currentStep === 4 && values.belief.trim() && (
              <div className="rounded-lg border border-white/8 bg-white/[2%] px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  {t("exercise.e.originalBelief")}
                </p>
                <p className="text-sm italic text-zinc-400">{values.belief}</p>
              </div>
            )}

            {/* Textarea — hidden for step C which has its own UI */}
            {currentStep !== 2 && (
              <Textarea
                id={`step-${step.key}`}
                placeholder={step.placeholder}
                className="min-h-40 resize-none border-white/5 bg-white/[3%] text-zinc-200 placeholder:text-zinc-600 focus:border-white/10 focus:ring-1 focus:ring-indigo-500/30"
                value={values[step.key]}
                onChange={(e) => setValue(step.key, e.target.value)}
              />
            )}

            {/* AI assist button — only on steps D (3) and E (4) */}
            {(currentStep === 3 || currentStep === 4) && (() => {
              const hasABC = values.activating_event.trim() && values.belief.trim() && values.consequence.trim();
              const needsD = currentStep === 4 && !values.disputation.trim();
              const canAssist = hasABC && !needsD;
              const tooltip = !hasABC
                ? t("exercise.assist.needsABC")
                : needsD
                  ? t("exercise.assist.needsD")
                  : undefined;

              return (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-zinc-100 disabled:opacity-40"
                    disabled={!canAssist || assistLoading}
                    onClick={handleAssist}
                  >
                    {assistLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t("exercise.assist.loading")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
                        </svg>
                        {t("exercise.assist.button")}
                      </span>
                    )}
                  </Button>
                  {tooltip && (
                    <span className="text-[10px] text-zinc-600">{tooltip}</span>
                  )}
                  {assistError && (
                    <span className="text-[10px] text-rose-400">{assistError}</span>
                  )}
                </div>
              );
            })()}

            {/* Hint questions — read-only guidance */}
            {step.hints.length > 0 && (
              <div className="space-y-2.5 pt-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  {t(step.hintsLabel)}
                </p>
                <ul className="space-y-1.5">
                  {step.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-400">
                      <span className="mt-0.5 text-zinc-600">&#8250;</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI assist result panel */}
            {assistResult && (
              <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/[3%] px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400/70 mb-2">{t("exercise.assist.title")}</p>
                <p className="text-sm leading-relaxed text-zinc-300">{assistResult.tip}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="animate-fade-in-up stagger-3 flex items-center justify-between">
        <Button
          variant="outline"
          className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-zinc-100"
          disabled={isFirst || submitting}
          onClick={() => goToStep(currentStep - 1)}
        >
          {t("exercise.previous")}
        </Button>

        {isLast ? (
          <Button
            className="border-0 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            disabled={
              !values.activating_event.trim() ||
              !values.belief.trim() ||
              !values.consequence.trim() ||
              submitting
            }
            onClick={handleComplete}
          >
            {submitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("exercise.saving")}
              </>
            ) : (
              t("exercise.complete")
            )}
          </Button>
        ) : (
          <Button
            className="border-0 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            disabled={submitting}
            onClick={() => goToStep(currentStep + 1)}
          >
            {t("exercise.next")}
          </Button>
        )}
      </div>

      {/* Summary of completed steps (mini cards below) */}
      {currentStep > 0 && (
        <div className="space-y-2 pt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {t("exercise.completedSteps")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.slice(0, currentStep).map((s, i) => {
              const c = STEP_COLORS[i];
              const val = values[s.key];
              if (!val.trim()) return null;
              return (
                <button
                  key={s.key}
                  onClick={() => goToStep(i)}
                  className="glass-card cursor-pointer p-3 text-left transition-all hover:bg-white/[7%] hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${c.text}`}>{s.letter}</span>
                    <span className="text-xs font-medium text-zinc-400">{s.label}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                    {val}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
