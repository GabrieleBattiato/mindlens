export interface FactInterpretation {
  facts: string[];
  interpretations: string[];
}

export interface EmotionItem {
  name: string;
  intensity: number;
  is_primary: boolean;
}

export interface ABCModel {
  activating_event: string;
  belief: string;
  consequence: string;
}

export interface CognitiveDistortion {
  name: string;
  evidence: string;
  confidence: number;
}

export interface BeliefAnalysis {
  core_belief: string | null;
  intermediate_rules: string[];
  evidence_for: string[];
  evidence_against: string[];
}

export type MaintenanceCycleType =
  | "avoidance"
  | "checking"
  | "rumination"
  | "reassurance_seeking"
  | "safety_behavior";

export interface MaintenanceCycle {
  cycle_type: MaintenanceCycleType;
  description: string;
  maintaining_factors: string[];
}

export interface Reframe {
  alternative_thought: string;
  reasoning: string;
}

export interface CBTExercise {
  type: string;
  title: string;
  description: string;
  steps: string[];
}

export interface LLMAnalysisResult {
  summary: string;
  fact_vs_interpretation: FactInterpretation;
  emotions: EmotionItem[];
  abc_model: ABCModel;
  cognitive_distortions: CognitiveDistortion[];
  belief_analysis: BeliefAnalysis | null;
  maintenance_cycle: MaintenanceCycle | null;
  reframe: Reframe;
  cbt_exercises: CBTExercise[];
  pattern_hints: string[];
  needs_clarification?: boolean;
  clarification_questions?: string[];
}

export interface AnalysisResponse {
  id: string;
  created_at: string;
  updated_at: string | null;
  input_mode: "free" | "guided";
  raw_input: string;
  guided_situation: string | null;
  guided_thoughts: string | null;
  guided_emotions: string | null;
  guided_intensity: number | null;
  guided_behaviors: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  result_json: LLMAnalysisResult | null;
  error_message: string | null;
}

export interface PatternItem {
  name: string;
  occurrences: number;
}

export interface DashboardSummary {
  total_analyses: number;
  completed_analyses: number;
  failed_analyses: number;
  total_exercises: number;
  top_distortions: PatternItem[];
  top_emotions: PatternItem[];
  recent_analyses: Record<string, unknown>[];
}

export interface ExerciseCreate {
  analysis_id?: string;
  activating_event: string;
  belief: string;
  consequence: string;
  disputation?: string;
  effective_new_belief?: string;
  new_emotion?: string;
  new_behavior?: string;
  notes?: string;
}

export interface ExerciseResponse {
  id: string;
  created_at: string;
  updated_at: string | null;
  analysis_id: string | null;
  activating_event: string;
  belief: string;
  consequence: string;
  disputation: string | null;
  effective_new_belief: string | null;
  new_emotion: string | null;
  new_behavior: string | null;
  notes: string | null;
  status: "in_progress" | "completed";
}

// Exercise assist (AI-assisted disputation)
export interface AssistRequest {
  step: "disputation" | "new_belief";
  activating_event: string;
  belief: string;
  consequence: string;
  disputation?: string;
}

export interface AssistResponse {
  step: string;
  tip: string;
}

export interface ProviderSettings {
  provider: "ollama";
  model: string;
  temperature: number;
  max_tokens: number;
  ollama_base_url: string;
  ollama_model: string;
}

export interface ProviderSettingsUpdate {
  model?: string;
  ollama_base_url?: string;
}
