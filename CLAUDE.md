# MindLens

Local CBT self-registration and cognitive analysis tool. Not a therapy chatbot, not a generic journal — a **cognitive lens**: structured, sober, precise.

## Stack

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react)
- **Backend:** FastAPI (Python 3.11+, Pydantic v2, SQLAlchemy 2.0) + SQLite
- **LLM:** Ollama local (default: `qwen3:8b`)

## Running the project

```bash
./dev.sh
```

This starts the API (port 8000) and the web app (port 3000). Requires Ollama running separately:

```bash
ollama serve
ollama pull qwen3:4b
```

For manual setup see README.md.

## Structure

```
apps/
  api/            → FastAPI backend
    app/          → config, database, models, schemas, routers, services, providers
    prompts/      → System/user prompt templates for the LLM
  web/            → Next.js app
    src/app/      → Pages (App Router)
    src/components/ → UI components
    src/lib/      → API client, types, i18n, utils, distortion-labels
```

## Pages

- `/` — Dashboard: stats, top distortions/emotions, action cards
- `/exercise/abcde` — Primary entry point: step-by-step ABCDE exercise → triggers AI analysis on completion
- `/analysis/[id]` — Configurable result cards: summary, emotions, distortions, ABC, fact vs interpretation, reframe, beliefs, maintenance cycle, patterns, exercises
- `/learn` — Educational section: CBT, ABC model, distortions
- `/history` — Past analyses with filters and deletion
- `/settings` — Language (ES/EN), Ollama model, URL, theme

## Conventions

- **Python:** ruff format, ruff check. Strict typing. Pydantic v2 for schemas.
- **TypeScript:** prettier, eslint. Strict mode.
- **Env vars:** `CBD_` prefix (via pydantic-settings)
- **i18n:** ES/EN via `src/lib/i18n/translations.ts`. Language selector in Settings.
- **Icons:** lucide-react (no unicode).
- **App tone:** clinical, sober, precise. No blind validation, no diagnoses, no empty motivational phrases. Distinguish fact vs interpretation, thought vs emotion.
- **LLM JSON contract:** defined in `apps/api/app/schemas/llm_response.py`. All LLM output is validated against this schema.
- **Provider layer:** Protocol-based (`providers/base.py`). Provider returns raw string, parsing in service layer.
- **Prompts:** all prompt files in `apps/api/prompts/` are written in English. The LLM is instructed within each prompt to output content in Spanish (Latin American).
