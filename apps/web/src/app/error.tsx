"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <span className="gradient-text text-5xl font-bold">{t("error.title")}</span>
      <p className="max-w-md text-center text-sm text-zinc-400">
        {error.message || t("error.fallback")}
      </p>
      <Button
        variant="outline"
        className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
        onClick={reset}
      >
        {t("error.retry")}
      </Button>
    </div>
  );
}
