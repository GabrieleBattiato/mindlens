"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAnalyses, deleteAnalysis, retryAnalysis } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { AnalysisResponse } from "@/lib/types";

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: AnalysisResponse["status"] }) {
  const { t } = useI18n();
  const config = {
    completed: {
      label: t("history.statusCompleted"),
      classes:
        "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30",
    },
    failed: {
      label: t("history.statusFailed"),
      classes:
        "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/30",
    },
    processing: {
      label: t("history.statusProcessing"),
      classes:
        "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30 animate-pulse",
    },
    pending: {
      label: t("history.statusPending"),
      classes:
        "bg-gradient-to-r from-zinc-500/20 to-slate-500/20 text-zinc-300 border-zinc-500/30",
    },
    cancelled: {
      label: t("history.statusCancelled"),
      classes:
        "bg-gradient-to-r from-zinc-500/20 to-slate-500/20 text-zinc-400 border-zinc-500/30",
    },
  } as const;

  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${classes}`}
    >
      {label}
    </span>
  );
}

/* ---------- Skeleton loading state ---------- */
function SkeletonCards() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-10 w-52 rounded-lg bg-white/5" />
        <Skeleton className="mt-3 h-4 w-80 rounded-lg bg-white/5" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass-card animate-fade-in-up p-5"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded bg-white/5" />
              <Skeleton className="h-5 w-20 rounded-full bg-white/5" />
            </div>
            <Skeleton className="mt-4 h-4 w-full rounded bg-white/5" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded bg-white/5" />
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center py-16">
      <div className="glass-card animate-fade-in-up mx-auto max-w-md p-8 text-center">
        {/* Decorative icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
          <svg
            className="h-8 w-8 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-zinc-100">
          {t("history.empty")}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {t("history.emptyDesc")}
        </p>

        <div className="mt-6">
          <Button
            render={<Link href="/exercise/abcde" />}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 border-0 px-5 py-2 h-9 font-medium shadow-lg shadow-indigo-500/20"
          >
            {t("history.createFirst")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page ---------- */
export default function HistoryPage() {
  const { t } = useI18n();
  const [analyses, setAnalyses] = useState<AnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      try {
        const data = await getAnalyses({
          sort_by: "created_at",
          sort_order: "desc",
        });
        if (!cancelled) setAnalyses(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : t("history.loadError")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRetry(id: string) {
    setRetrying(id);
    try {
      const updated = await retryAnalysis(id);
      setAnalyses((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      toast.error(t("history.retryError"));
    } finally {
      setRetrying(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success(t("history.deleted"));
    } catch {
      toast.error(t("history.deleteError"));
    }
  }

  if (loading) return <SkeletonCards />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">{t("history.title")}</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {t("history.subtitle")}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card animate-fade-in-up stagger-2 border-l-4 border-l-red-500/60 p-5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!error && analyses.length === 0 && <EmptyState />}

      {/* Card grid */}
      {analyses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((a, i) => (
            <div
              key={a.id}
              className="group relative"
            >
              <Link
                href={retrying === a.id ? "#" : `/analysis/${a.id}`}
                onClick={retrying === a.id ? (e) => e.preventDefault() : undefined}
                aria-disabled={retrying === a.id}
              >
                <div
                  className={`glass-card-hover animate-fade-in-up relative h-full p-5 pb-12 ${retrying === a.id ? "cursor-not-allowed opacity-60 pointer-events-none" : "cursor-pointer"}`}
                  style={{ animationDelay: `${(i % 9) * 0.06}s` }}
                >
                  {/* Top row: date + status */}
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium text-zinc-500 transition-colors duration-200 group-hover:text-zinc-400">
                      {formatDate(a.created_at)}
                    </p>
                    <StatusBadge status={a.status} />
                  </div>

                  {/* Summary text */}
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300 transition-colors duration-200 group-hover:text-zinc-200">
                    {a.result_json?.summary
                      ? truncate(a.result_json.summary, 120)
                      : truncate(a.raw_input, 120)}
                  </p>

                  {/* Model + duration */}
                  {(a.model_used || a.duration_seconds) && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] text-zinc-600">
                      {a.model_used && (
                        <span className="font-mono">{a.model_used}</span>
                      )}
                      {a.model_used && a.duration_seconds && <span>&middot;</span>}
                      {a.duration_seconds != null && (
                        <span>{a.duration_seconds < 60 ? `${Math.round(a.duration_seconds)}s` : `${Math.floor(a.duration_seconds / 60)}m ${Math.round(a.duration_seconds % 60)}s`}</span>
                      )}
                    </div>
                  )}

                </div>
              </Link>

              {/* Action buttons */}
              <div className="absolute bottom-5 right-5 flex items-center gap-1">
                {/* Re-analyze */}
                {(a.status === "completed" || a.status === "failed" || a.status === "cancelled") && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRetry(a.id); }}
                    disabled={retrying === a.id}
                    className="rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all hover:bg-amber-500/10 hover:text-amber-400 group-hover:opacity-100 disabled:opacity-50"
                    title={t("history.reanalyze")}
                  >
                    <svg
                      className={`h-4 w-4 ${retrying === a.id ? "animate-spin" : ""}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(a.id);
                  }}
                  className="rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  title={t("history.deleteAction")}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xs animate-scale-in rounded-2xl border border-red-500/20 bg-zinc-900 p-6 shadow-2xl shadow-red-500/10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm font-medium text-zinc-200">
              {t("history.deleteConfirm")}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-200"
              >
                {t("history.deleteCancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDelete(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-xl bg-red-500/20 py-2.5 text-sm font-medium text-red-400 ring-1 ring-red-500/30 transition-all hover:bg-red-500/30 hover:text-red-300"
              >
                {t("history.deleteAction")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
