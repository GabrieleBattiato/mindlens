export interface ThemeConfig {
  grad1: string; // hex — gradient start
  grad2: string; // hex — gradient mid
  grad3: string; // hex — gradient end
  intensity?: number; // 0-1, controls orb opacity (default 1)
}

export interface ThemePreset {
  id: string;
  name: string;
  config: ThemeConfig;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "nebula",    name: "Nebula",    config: { grad1: "#38bdf8", grad2: "#818cf8", grad3: "#c084fc" } },
  { id: "aurora",    name: "Aurora",    config: { grad1: "#34d399", grad2: "#22d3ee", grad3: "#60a5fa" } },
  { id: "sunset",    name: "Sunset",    config: { grad1: "#fb923c", grad2: "#f472b6", grad3: "#c084fc" } },
  { id: "phosphor",  name: "Phosphor",  config: { grad1: "#86efac", grad2: "#4ade80", grad3: "#22d3ee" } },
];

export const DEFAULT_THEME: ThemeConfig = THEME_PRESETS[0].config;

const STORAGE_KEY = "cbd-theme-v1";

/** Apply theme vars to :root immediately (DOM side-effect). */
export function applyTheme(config: ThemeConfig): void {
  const root = document.documentElement;
  root.style.setProperty("--grad-1", config.grad1);
  root.style.setProperty("--grad-2", config.grad2);
  root.style.setProperty("--grad-3", config.grad3);
  root.style.setProperty("--grad-intensity", String(config.intensity ?? 1));
}

/** Persist + apply. */
export function saveTheme(config: ThemeConfig): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
  applyTheme(config);
}

/** Load saved theme or return default. */
export function loadTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    return { ...DEFAULT_THEME, ...JSON.parse(raw) };
  } catch { return DEFAULT_THEME; }
}

/** Check if a config matches a preset exactly. Returns preset id or null. */
export function matchPreset(config: ThemeConfig): string | null {
  for (const p of THEME_PRESETS) {
    if (p.config.grad1 === config.grad1 && p.config.grad2 === config.grad2 && p.config.grad3 === config.grad3)
      return p.id;
  }
  return null;
}

/** Inline script string to inject in <head> — prevents FOUC. */
export const THEME_INIT_SCRIPT = `(function(){try{
  var t=JSON.parse(localStorage.getItem('cbd-theme-v1')||'null');
  if(t&&t.grad1){
    var r=document.documentElement;
    r.style.setProperty('--grad-1',t.grad1);
    r.style.setProperty('--grad-2',t.grad2);
    r.style.setProperty('--grad-3',t.grad3);
    if(t.intensity!=null)r.style.setProperty('--grad-intensity',String(t.intensity));
  }
}catch(e){}})();`;
