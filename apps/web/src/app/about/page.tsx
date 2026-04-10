"use client";

import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-12 pb-20">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">{t("about.title")}</span>
        </h1>
      </div>

      {/* About */}
      <section className="space-y-5">
        <p className="text-[15px] leading-relaxed text-zinc-300">
          {t("about.p1")}
        </p>
      </section>

      {/* Model quality */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-100">
          {t("about.modelQuality.title")}
        </h2>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("about.modelQuality.p1")}
        </p>
        <p className="text-[15px] leading-relaxed text-zinc-400">
          {t("about.modelQuality.p2")}
        </p>
      </section>

      {/* Disclaimer */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[4%] px-6 py-4">
        <p className="text-sm leading-relaxed text-amber-300/80">
          {t("about.disclaimer")}
        </p>
      </div>
    </div>
  );
}
