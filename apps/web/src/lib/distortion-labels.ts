const DISTORTION_MAP: Record<string, { es: string; en: string }> = {
  // Standard names (English keys from the LLM)
  "all_or_nothing_thinking": { es: "Pensamiento todo o nada", en: "All-or-nothing thinking" },
  "all_or_nothing": { es: "Pensamiento todo o nada", en: "All-or-nothing thinking" },
  "overgeneralization": { es: "Sobregeneralizacion", en: "Overgeneralization" },
  "mental_filter": { es: "Filtro mental", en: "Mental filter" },
  "disqualifying_the_positive": { es: "Descalificar lo positivo", en: "Disqualifying the positive" },
  "jumping_to_conclusions": { es: "Saltar a conclusiones", en: "Jumping to conclusions" },
  "mind_reading": { es: "Lectura de mente", en: "Mind reading" },
  "fortune_telling": { es: "Adivinacion", en: "Fortune telling" },
  "magnification": { es: "Magnificacion", en: "Magnification" },
  "minimization": { es: "Minimizacion", en: "Minimization" },
  "catastrophizing": { es: "Catastrofizacion", en: "Catastrophizing" },
  "emotional_reasoning": { es: "Razonamiento emocional", en: "Emotional reasoning" },
  "should_statements": { es: "Declaraciones de deberia", en: "Should statements" },
  "labeling": { es: "Etiquetado", en: "Labeling" },
  "personalization": { es: "Personalizacion", en: "Personalization" },
  "blame": { es: "Culpa", en: "Blame" },
  "fallacy_of_fairness": { es: "Falacia de justicia", en: "Fallacy of fairness" },
  "fallacy_of_change": { es: "Falacia de cambio", en: "Fallacy of change" },
  "always_being_right": { es: "Siempre tener razon", en: "Always being right" },
  "heavens_reward_fallacy": { es: "Falacia de recompensa divina", en: "Heaven's reward fallacy" },

  // Maintenance cycle types
  "avoidance": { es: "Evitacion", en: "Avoidance" },
  "checking": { es: "Chequeo", en: "Checking" },
  "rumination": { es: "Rumiacion", en: "Rumination" },
  "reassurance_seeking": { es: "Busqueda de certeza", en: "Reassurance seeking" },
  "safety_behavior": { es: "Conducta de seguridad", en: "Safety behavior" },

  // Common pattern hint tags
  "perfectionism": { es: "Perfeccionismo", en: "Perfectionism" },
  "social_evaluation": { es: "Evaluacion social", en: "Social evaluation" },
  "control": { es: "Control", en: "Control" },
  "self_worth": { es: "Autovaloracion", en: "Self-worth" },
  "self_worth_contingent_on_performance": { es: "Autovaloracion por rendimiento", en: "Self-worth contingent on performance" },
  "catastrophizing_about_health": { es: "Catastrofizacion de salud", en: "Health catastrophizing" },
  "fear_of_failure": { es: "Miedo al fracaso", en: "Fear of failure" },
  "fear_of_rejection": { es: "Miedo al rechazo", en: "Fear of rejection" },
  "need_for_approval": { es: "Necesidad de aprobacion", en: "Need for approval" },
  "intolerance_of_uncertainty": { es: "Intolerancia a la incertidumbre", en: "Intolerance of uncertainty" },
};

/**
 * Translates a distortion/pattern name from its raw key form to a human-readable label.
 * Handles: underscore_names, already-readable names, and unknown names (formats them nicely).
 */
export function formatLabel(raw: string, locale: "es" | "en"): string {
  const key = raw.toLowerCase().trim();

  // Direct match
  const match = DISTORTION_MAP[key];
  if (match) return match[locale];

  // Try without trailing/leading spaces and normalized
  const normalized = key.replace(/\s+/g, "_");
  const matchNorm = DISTORTION_MAP[normalized];
  if (matchNorm) return matchNorm[locale];

  // Fallback: replace underscores with spaces and capitalize first letter
  return raw
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}
