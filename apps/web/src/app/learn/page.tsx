"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function LearnPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl space-y-16 pb-20">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="gradient-text">{t("learn.title")}</span>
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          {t("learn.subtitle")}
        </p>
      </div>

      {/* What is CBT */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-zinc-100">
          {t("learn.cbt.title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-zinc-300">
          {t("learn.cbt.p1")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.cbt.p2")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.cbt.p3")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.cbt.p4")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.cbt.p5")}
        </p>
      </section>

      {/* ABC Model */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">
            {t("learn.abc.title")}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {t("learn.abc.subtitle")}
          </p>
        </div>

        {/* ABC visual diagram */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* A */}
          <div className="relative">
            <div className="glass-card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-lg font-bold text-blue-400 ring-1 ring-blue-500/30">
                  A
                </span>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">{t("learn.abc.a.title")}</h3>
                <p className="mt-1 text-xs text-zinc-500">{t("learn.abc.a.desc")}</p>
                <p className="mt-3 rounded-lg border border-white/5 bg-white/[3%] px-3 py-2 text-xs italic leading-relaxed text-zinc-400">
                  &ldquo;{t("learn.abc.a.example")}&rdquo;
                </p>
              </div>
            </div>
            <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-zinc-600 sm:block">&rarr;</div>
          </div>

          {/* B */}
          <div className="relative">
            <div className="glass-card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-lg font-bold text-violet-400 ring-1 ring-violet-500/30">
                  B
                </span>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">{t("learn.abc.b.title")}</h3>
                <p className="mt-1 text-xs text-zinc-500">{t("learn.abc.b.desc")}</p>
                <p className="mt-3 rounded-lg border border-white/5 bg-white/[3%] px-3 py-2 text-xs italic leading-relaxed text-zinc-400">
                  &ldquo;{t("learn.abc.b.example")}&rdquo;
                </p>
              </div>
            </div>
            <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-zinc-600 sm:block">&rarr;</div>
          </div>

          {/* C */}
          <div>
            <div className="glass-card relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent" />
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-lg font-bold text-rose-400 ring-1 ring-rose-500/30">
                  C
                </span>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">{t("learn.abc.c.title")}</h3>
                <p className="mt-1 text-xs text-zinc-500">{t("learn.abc.c.desc")}</p>
                <p className="mt-3 rounded-lg border border-white/5 bg-white/[3%] px-3 py-2 text-xs italic leading-relaxed text-zinc-400">
                  &ldquo;{t("learn.abc.c.example")}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key insight callout */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[4%] px-6 py-4">
          <p className="text-sm leading-relaxed text-cyan-300/90">
            {t("learn.abc.key")}
          </p>
        </div>
      </section>

      {/* Cognitive distortions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">
          {t("learn.distortions.title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.distortions.intro")}
        </p>

        <DistortionGrid t={t} />
      </section>

      {/* ABCDEF extension */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-100">
          {t("learn.abcdef.title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.abcdef.intro")}
        </p>

        {/* Visual: ABC (existing) + DEF (new) */}
        <div className="space-y-3">
          {/* ABC recap row */}
          <div className="flex gap-2">
            {["A", "B", "C"].map((letter) => (
              <div key={letter} className="flex h-10 flex-1 items-center justify-center rounded-xl bg-white/[3%] border border-white/5 text-sm font-bold text-zinc-500">
                {letter}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex justify-center text-zinc-600 text-lg">&darr;</div>

          {/* D */}
          <div className="glass-card relative overflow-hidden p-5 pl-16">
            <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-sm font-bold text-amber-400 ring-1 ring-amber-500/30">
              D
            </span>
            <h3 className="text-sm font-semibold text-zinc-200">{t("learn.abcdef.d.title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t("learn.abcdef.d.desc")}</p>
          </div>

          {/* E */}
          <div className="glass-card relative overflow-hidden p-5 pl-16">
            <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/30">
              E
            </span>
            <h3 className="text-sm font-semibold text-zinc-200">{t("learn.abcdef.e.title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t("learn.abcdef.e.desc")}</p>
          </div>

          {/* F */}
          <div className="glass-card relative overflow-hidden p-5 pl-16">
            <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/30">
              F
            </span>
            <h3 className="text-sm font-semibold text-zinc-200">{t("learn.abcdef.f.title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t("learn.abcdef.f.desc")}</p>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-zinc-100">
          {t("learn.why.title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-zinc-300">
          {t("learn.why.p1")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.why.p2")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.why.p3")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.why.p4")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("learn.why.p5")}
        </p>

      </section>

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/exercise/abcde"
          className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
        >
          {t("learn.ctaExercise")}
        </Link>
      </div>
    </div>
  );
}

// ─── Distortion cards ─────────────────────────────────────────────────────────

type TFn = (key: import("@/lib/i18n").TranslationKey) => string;

interface Distortion { name: string; desc: string; ex: string }

function DistortionOverlay({ d, onClose }: { d: Distortion; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md animate-scale-in rounded-2xl border border-amber-500/20 bg-zinc-900 p-6 shadow-2xl shadow-amber-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-semibold text-amber-400">{d.name}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{d.desc}</p>
        <div className="mt-4 space-y-1.5 rounded-xl bg-white/[3%] p-4">
          {d.ex.split(" | ").map((ex, i) => (
            <p key={i} className="text-[13px] italic leading-relaxed text-zinc-400">
              &ldquo;{ex}&rdquo;
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-white/5 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

function DistortionGrid({ t }: { t: TFn }) {
  const [selected, setSelected] = useState<Distortion | null>(null);

  const distortions: Distortion[] = [
    { name: t("learn.distortions.allOrNothing"), desc: t("learn.distortions.allOrNothingDesc"), ex: t("learn.distortions.allOrNothingEx") },
    { name: t("learn.distortions.overgeneralization"), desc: t("learn.distortions.overgeneralizationDesc"), ex: t("learn.distortions.overgeneralizationEx") },
    { name: t("learn.distortions.mentalFilter"), desc: t("learn.distortions.mentalFilterDesc"), ex: t("learn.distortions.mentalFilterEx") },
    { name: t("learn.distortions.discountingPositives"), desc: t("learn.distortions.discountingPositivesDesc"), ex: t("learn.distortions.discountingPositivesEx") },
    { name: t("learn.distortions.jumpingToConclusions"), desc: t("learn.distortions.jumpingToConclusionsDesc"), ex: t("learn.distortions.jumpingToConclusionsEx") },
    { name: t("learn.distortions.mindReading"), desc: t("learn.distortions.mindReadingDesc"), ex: t("learn.distortions.mindReadingEx") },
    { name: t("learn.distortions.fortuneTelling"), desc: t("learn.distortions.fortuneTellingDesc"), ex: t("learn.distortions.fortuneTellingEx") },
    { name: t("learn.distortions.magnification"), desc: t("learn.distortions.magnificationDesc"), ex: t("learn.distortions.magnificationEx") },
    { name: t("learn.distortions.emotionalReasoning"), desc: t("learn.distortions.emotionalReasoningDesc"), ex: t("learn.distortions.emotionalReasoningEx") },
    { name: t("learn.distortions.shouldStatements"), desc: t("learn.distortions.shouldStatementsDesc"), ex: t("learn.distortions.shouldStatementsEx") },
    { name: t("learn.distortions.labeling"), desc: t("learn.distortions.labelingDesc"), ex: t("learn.distortions.labelingEx") },
    { name: t("learn.distortions.personalization"), desc: t("learn.distortions.personalizationDesc"), ex: t("learn.distortions.personalizationEx") },
    { name: t("learn.distortions.alwaysBeingRight"), desc: t("learn.distortions.alwaysBeingRightDesc"), ex: t("learn.distortions.alwaysBeingRightEx") },
    { name: t("learn.distortions.magicalThinking"), desc: t("learn.distortions.magicalThinkingDesc"), ex: t("learn.distortions.magicalThinkingEx") },
  ];

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {distortions.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSelected(d)}
            className="glass-card cursor-pointer p-4 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-md hover:shadow-amber-500/5 hover:border-amber-500/15"
          >
            <p className="text-sm font-medium text-amber-400/90">{d.name}</p>
          </button>
        ))}
      </div>
      {selected && <DistortionOverlay d={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
