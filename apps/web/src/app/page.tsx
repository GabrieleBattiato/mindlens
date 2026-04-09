"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardSummary } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useModelHealth } from "@/lib/model-health-context";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatLabel } from "@/lib/distortion-labels";
import type { DashboardSummary } from "@/lib/types";

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { recheck } = useModelHealth();

  useEffect(() => {
    recheck();
  }, [recheck]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const summary = await getDashboardSummary();
        if (!cancelled) setData(summary);
      } catch {
        if (!cancelled)
          setData({
            total_analyses: 0,
            completed_analyses: 0,
            failed_analyses: 0,
            total_exercises: 0,
            top_distortions: [],
            top_emotions: [],
            recent_analyses: [],
          });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      label: t("home.stats.analyses"),
      value: data?.total_analyses,
      icon: "\u2261",
      color: "from-cyan-500/20 to-cyan-500/5",
      textColor: "text-cyan-400",
    },
    {
      label: t("home.stats.completed"),
      value: data?.completed_analyses,
      icon: "\u2713",
      color: "from-emerald-500/20 to-emerald-500/5",
      textColor: "text-emerald-400",
    },
    {
      label: t("home.stats.exercises"),
      value: data?.total_exercises,
      icon: "\u25CB",
      color: "from-violet-500/20 to-violet-500/5",
      textColor: "text-violet-400",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="animate-fade-in-up stagger-1 pt-2 text-center">
        <h1 className="gradient-text text-4xl font-bold tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-zinc-400">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Action cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* ABCDEF directo */}
        <Link href="/exercise/abcde" className="group animate-fade-in-up stagger-2">
          <div className="glass-card-hover relative h-full p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-emerald-500/12 via-emerald-500/4 to-transparent" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/12 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/22 group-hover:scale-110" />
            <div className="relative">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-lg font-bold text-emerald-300 ring-1 ring-emerald-400/30 font-mono transition-all duration-300 group-hover:bg-emerald-500/25 group-hover:ring-emerald-400/50 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                A&rarr;F
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
                {t("home.abcdef")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                {t("home.abcdefDesc")}
              </p>
            </div>
          </div>
        </Link>

        {/* Ver Historial */}
        <Link href="/history" className="group animate-fade-in-up stagger-4">
          <div className="glass-card-hover relative h-full p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-fuchsia-500/12 via-fuchsia-500/4 to-transparent" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-fuchsia-400/12 blur-3xl transition-all duration-500 group-hover:bg-fuchsia-400/22 group-hover:scale-110" />
            <div className="relative">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-500/15 text-2xl font-bold text-fuchsia-300 ring-1 ring-fuchsia-400/30 transition-all duration-300 group-hover:bg-fuchsia-500/25 group-hover:ring-fuchsia-400/50 group-hover:shadow-lg group-hover:shadow-fuchsia-500/20">
                {"\u2630"}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
                {t("home.history")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                {t("home.historyDesc")}
              </p>
            </div>
          </div>
        </Link>

        {/* Aprender CBT */}
        <Link href="/learn" className="group animate-fade-in-up stagger-4">
          <div className="glass-card-hover relative h-full p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br from-amber-500/12 via-amber-500/4 to-transparent" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-400/12 blur-3xl transition-all duration-500 group-hover:bg-amber-400/22 group-hover:scale-110" />
            <div className="relative">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-2xl font-bold text-amber-300 ring-1 ring-amber-400/30 transition-all duration-300 group-hover:bg-amber-500/25 group-hover:ring-amber-400/50 group-hover:shadow-lg group-hover:shadow-amber-500/20">
                {"\u25C7"}
              </span>
              <h2 className="mt-4 text-xl font-semibold text-white/90 transition-colors duration-300 group-hover:text-white">
                {t("home.learn")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                {t("home.learnDesc")}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`glass-card animate-fade-in-up stagger-${i + 4} relative p-5`}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] bg-gradient-to-br ${stat.color}`}
            />
            <div className="relative">
              <span
                className={`text-lg font-mono font-bold ${stat.textColor}`}
              >
                {stat.icon}
              </span>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-zinc-500">
                {stat.label}
              </p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-12 rounded bg-white/5" />
              ) : (
                <p className={`mt-2 text-3xl font-bold tabular-nums ${stat.textColor}`}>
                  {stat.value ?? 0}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Top patterns */}
      {data &&
        (data.top_distortions.length > 0 || data.top_emotions.length > 0) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {data.top_distortions.length > 0 && (
              <div className="glass-card relative animate-fade-in-up stagger-8 overflow-hidden p-5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-600/5 via-transparent to-transparent" />
                <h3 className="relative mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  <span className="mr-2 inline-block text-rose-400">
                    {"\u26A0"}
                  </span>
                  {t("home.topDistortions")}
                  <InfoTooltip content={t("info.topDistortions")} className="ml-1" />
                </h3>
                <div className="relative space-y-3">
                  {data.top_distortions.slice(0, 5).map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-zinc-300">{formatLabel(d.name, locale)}</span>
                      <Badge
                        variant="secondary"
                        className="bg-rose-500/10 text-[11px] text-rose-400 ring-1 ring-rose-500/20"
                      >
                        {d.occurrences}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.top_emotions.length > 0 && (
              <div className="glass-card relative animate-fade-in-up stagger-8 overflow-hidden p-5">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-transparent" />
                <h3 className="relative mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  <span className="mr-2 inline-block text-violet-400">
                    {"\u2665"}
                  </span>
                  {t("home.topEmotions")}
                  <InfoTooltip content={t("info.topEmotions")} className="ml-1" />
                </h3>
                <div className="relative space-y-3">
                  {data.top_emotions.slice(0, 5).map((e) => (
                    <div
                      key={e.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-zinc-300">{formatLabel(e.name, locale)}</span>
                      <Badge
                        variant="secondary"
                        className="bg-violet-500/10 text-[11px] text-violet-400 ring-1 ring-violet-500/20"
                      >
                        {e.occurrences}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* About link */}
      <div className="flex justify-center pt-4">
        <Link
          href="/about"
          className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
        >
          {t("about.title")}
        </Link>
      </div>
    </div>
  );
}
