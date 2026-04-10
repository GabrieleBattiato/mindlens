"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <span className="gradient-text text-7xl font-bold">404</span>
      <p className="text-sm text-zinc-400">{t("notFound.message")}</p>
      <Button
        variant="outline"
        className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
        render={<Link href="/" />}
      >
        {t("notFound.back")}
      </Button>
    </div>
  );
}
