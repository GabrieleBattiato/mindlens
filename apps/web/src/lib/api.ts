const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function parseErrorBody(body: string): string {
  try {
    const parsed = JSON.parse(body);
    if (parsed.detail) {
      if (typeof parsed.detail === "string") return parsed.detail;
      if (Array.isArray(parsed.detail)) {
        return parsed.detail
          .map((d: { msg?: string }) => d.msg)
          .filter(Boolean)
          .join(". ");
      }
    }
  } catch {
    // not JSON — return as-is
  }
  return body;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, parseErrorBody(raw));
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Analysis
export interface AnalysisCreateFree {
  input_mode: "free";
  raw_input: string;
}

export interface AnalysisCreateGuided {
  input_mode: "guided";
  situation: string;
  thoughts: string;
  emotions: string;
  intensity: number;
  behaviors?: string;
}

export type AnalysisCreate = AnalysisCreateFree | AnalysisCreateGuided;

export async function createAnalysis(data: AnalysisCreate) {
  return request<AnalysisResponse>("/api/analyses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAnalysis(id: string) {
  return request<AnalysisResponse>(`/api/analyses/${id}`);
}

export async function getAnalyses(params?: {
  offset?: number;
  limit?: number;
  status?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined) searchParams.set(key, String(val));
    });
  }
  const query = searchParams.toString();
  return request<AnalysisResponse[]>(`/api/analyses${query ? `?${query}` : ""}`);
}

export async function deleteAnalysis(id: string) {
  return request<void>(`/api/analyses/${id}`, { method: "DELETE" });
}

export async function retryAnalysis(id: string) {
  return request<AnalysisResponse>(`/api/analyses/${id}/retry`, { method: "POST" });
}

// Dashboard
export async function getDashboardSummary() {
  return request<DashboardSummary>("/api/dashboard/summary");
}

// Exercise
export async function createExercise(data: ExerciseCreate) {
  return request<ExerciseResponse>("/api/exercises", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getExercise(id: string) {
  return request<ExerciseResponse>(`/api/exercises/${id}`);
}

export async function getExercises(analysisId?: string) {
  const query = analysisId ? `?analysis_id=${analysisId}` : "";
  return request<ExerciseResponse[]>(`/api/exercises${query}`);
}

export async function updateExercise(id: string, data: Partial<ExerciseCreate> & { status?: string }) {
  return request<ExerciseResponse>(`/api/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Exercise assist
export async function getExerciseAssist(data: AssistRequest) {
  return request<AssistResponse>("/api/exercises/assist", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Settings
export async function getSettings() {
  return request<ProviderSettings>("/api/settings");
}

export interface ModelHealth {
  ok: boolean;
  model: string;
  ollama_reachable: boolean;
  model_available: boolean;
  available_models: string[];
  error: "ollama_unreachable" | "model_not_found" | "unknown" | null;
}

export async function checkModelHealth() {
  return request<ModelHealth>("/api/settings/health");
}

export async function updateSettings(data: ProviderSettingsUpdate) {
  return request<ProviderSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Import types
import type {
  AnalysisResponse,
  AssistRequest,
  AssistResponse,
  DashboardSummary,
  ExerciseCreate,
  ExerciseResponse,
  ProviderSettings,
  ProviderSettingsUpdate,
} from "./types";
