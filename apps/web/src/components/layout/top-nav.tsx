"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function TopNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const homeActive = pathname === "/";
  const settingsActive = pathname.startsWith("/settings");

  return (
    <div className="flex justify-end px-4 animate-fade-in-down">
      <div
        className="flex items-center gap-1 rounded-2xl border border-white/[0.08] px-1.5 py-1.5 shadow-2xl shadow-black/40"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      >
        <Link
          href="/"
          className={`group relative flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
            homeActive
              ? "bg-white/10 text-white shadow-lg shadow-cyan-500/15"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]"
          }`}
          aria-label={t("nav.home")}
        >
          {homeActive && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/12 to-violet-500/12 border border-white/10" />
          )}
          <span className={`relative transition-transform duration-200 group-hover:scale-110 ${homeActive ? "text-cyan-400" : ""}`}>
            <Home size={16} strokeWidth={1.8} />
          </span>
        </Link>

        <Link
          href="/settings"
          className={`group relative flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
            settingsActive
              ? "bg-white/10 text-white shadow-lg shadow-cyan-500/15"
              : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]"
          }`}
          aria-label={t("nav.config")}
        >
          {settingsActive && (
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/12 to-violet-500/12 border border-white/10" />
          )}
          <span className={`relative transition-transform duration-200 group-hover:scale-110 group-hover:rotate-45 ${settingsActive ? "text-cyan-400" : ""}`}>
            <Settings size={16} strokeWidth={1.8} />
          </span>
        </Link>
      </div>
    </div>
  );
}
