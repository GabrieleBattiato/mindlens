"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { getSettings, updateSettings } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useModelHealth } from "@/lib/model-health-context";
import type { ProviderSettings } from "@/lib/types";
import { THEME_PRESETS, loadTheme, saveTheme, matchPreset } from "@/lib/theme";
import type { ThemeConfig } from "@/lib/theme";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { recheck } = useModelHealth();
  const [settings, setSettings] = useState<ProviderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(() =>
    typeof window !== "undefined" ? loadTheme() : { grad1: "#38bdf8", grad2: "#818cf8", grad3: "#c084fc" }
  );

  const handleThemeChange = useCallback((config: ThemeConfig) => {
    setTheme(config);
    saveTheme(config);
  }, []);

  // Form state
  const [model, setModel] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getSettings();
        if (cancelled) return;
        setSettings(data);
        setModel(data.model);
        setOllamaUrl(data.ollama_base_url);
      } catch {
        // Settings not available — use defaults
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateSettings({
        model: model || undefined,
        ollama_base_url: ollamaUrl || undefined,
      });
      setSettings(updated);
      toast.success(t("settings.saved"));
      recheck();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("settings.saveError")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-56 rounded-lg bg-white/5" />
          <Skeleton className="mt-3 h-4 w-80 rounded-lg bg-white/5" />
        </div>
        <Skeleton className="h-64 rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="animate-fade-in-up stagger-1">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">{t("settings.title")}</span>
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Language */}
      <div className="animate-fade-in-up stagger-2 glass-card space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-sm">
            Aa
          </span>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">{t("settings.language")}</h2>
            <p className="text-[11px] text-zinc-500">{t("settings.languageDesc")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {([["es", t("settings.langEs")], ["en", t("settings.langEn")]] as const).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                locale === code
                  ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : "text-zinc-400 border border-white/5 bg-white/[3%] hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ollama configuration */}
      <div className="animate-fade-in-up stagger-3 glass-card space-y-6 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-sm font-bold text-white">
            O
          </span>
          <h2 className="text-lg font-semibold text-zinc-100">
            {t("settings.ollama")}
          </h2>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-300">{t("settings.model")}</Label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="qwen3:8b"
            className="border-white/5 bg-white/[3%] text-sm placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
          />
        </div>

        {/* Ollama URL */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-zinc-300">
            {t("settings.ollamaUrl")}
          </Label>
          <Input
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            placeholder="http://localhost:11434"
            className="border-white/5 bg-white/[3%] text-sm placeholder:text-zinc-600 focus-visible:border-indigo-500/30 focus-visible:ring-indigo-500/20"
          />
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            className="border-0 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 font-medium text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("settings.saving")}
              </span>
            ) : (
              t("settings.save")
            )}
          </Button>
        </div>
      </div>

      {/* ─── Appearance / Theme ─── */}
      <div className="animate-fade-in-up stagger-4 glass-card space-y-6 p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-base">
            ◈
          </span>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">{t("settings.appearance")}</h2>
            <p className="text-[11px] text-zinc-500">{t("settings.appearanceDesc")}</p>
          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("settings.presets")}</p>
          <div className="flex flex-wrap gap-2">
            {THEME_PRESETS.map((preset) => {
              const active = matchPreset(theme) === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleThemeChange({ ...preset.config, intensity: theme.intensity })}
                  style={{
                    background: `linear-gradient(135deg, ${preset.config.grad1}, ${preset.config.grad2}, ${preset.config.grad3})`,
                  }}
                  className={`h-8 rounded-full px-4 text-[11px] font-semibold text-white/90 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    active ? "ring-2 ring-white/50 ring-offset-1 ring-offset-black scale-105 shadow-lg" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("settings.intensity")}</p>
            <span className="text-sm font-bold tabular-nums gradient-text">
              {Math.round((theme.intensity ?? 1) * 100)}%
            </span>
          </div>
          <Slider
            min={5}
            max={100}
            step={5}
            value={[Math.round((theme.intensity ?? 1) * 100)]}
            onValueChange={(val) => {
              const v = (Array.isArray(val) ? val[0] : val) / 100;
              handleThemeChange({ ...theme, intensity: v });
            }}
          />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>{t("settings.intensitySubtle")}</span>
            <span>{t("settings.intensityVibrant")}</span>
          </div>
        </div>

        {/* Custom color pickers */}
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{t("settings.customize")}</p>
          <div className="flex items-center gap-6">
            {(["grad1", "grad2", "grad3"] as const).map((key, i) => {
              const labels = [t("settings.colorStart"), t("settings.colorMid"), t("settings.colorEnd")];
              return (
                <label key={key} className="flex cursor-pointer flex-col items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">{labels[i]}</span>
                  <div
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/10 transition-all duration-150 hover:border-white/30 hover:scale-110"
                    style={{ backgroundColor: theme[key] }}
                  >
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) => handleThemeChange({ ...theme, [key]: e.target.value })}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="pointer-events-none text-[10px] font-mono text-white/60 drop-shadow">+</span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600">{theme[key]}</span>
                </label>
              );
            })}

            {/* Reset to default */}
            <button
              type="button"
              onClick={() => handleThemeChange({ ...THEME_PRESETS[0].config, intensity: theme.intensity })}
              className="ml-auto self-end rounded-lg px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600 transition-all hover:bg-white/5 hover:text-zinc-400"
            >
              {t("settings.reset")}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
