# MindLens

Local CBT self-registration and cognitive exploration tool. Not a therapy chatbot, not a generic journal — a **cognitive lens**: structured, sober, precise.

## Stack

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react)
- **Backend:** FastAPI (Python 3.11+, Pydantic v2, SQLAlchemy 2.0) + SQLite
- **LLM:** Ollama local (default: `qwen3:8b`)

## Running the project

Requires Ollama running separately:

```bash
ollama serve
ollama pull qwen3:8b
```

### API (terminal 1)
```bash
cd apps/api
source .venv/bin/activate
uvicorn app.main:app --reload --port 4000
```

### Web (terminal 2)
```bash
cd apps/web
npm run build
npm start -- --port 4001
```

Open [http://localhost:4001](http://localhost:4001)

## Structure

```
apps/
  api/            → FastAPI backend
    app/          → config, database, models, schemas, routers, services, providers
    prompts/      → System/user prompt templates for the LLM
  web/            → Next.js app
    src/app/      → Pages (App Router)
    src/components/ → UI components
    src/lib/      → API client, types, i18n, utils, theme, distortion-labels
```

## Pages

- `/` — Dashboard: stats, top distortions/emotions, action cards
- `/exercise/abcde` — Primary entry point: step-by-step ABC exercise → triggers background AI processing on completion
- `/analysis/[id]` — Result view: insight hero with summary + pattern chips, core insights (emotions, distortions, reframe), cognitive process flow, maintenance cycle, suggested exercises, collapsible deep beliefs
- `/learn` — Educational section: CBT, ABC model, distortions, why it works
- `/history` — Past entries with re-process and deletion
- `/settings` — Language (ES/EN), Ollama model, URL, visual theme
- `/about` — About the project, model quality note, disclaimer

## Conventions

- **Python:** ruff format, ruff check. Strict typing. Pydantic v2 for schemas.
- **TypeScript:** prettier, eslint. Strict mode.
- **Env vars:** `CBD_` prefix (via pydantic-settings)
- **i18n:** ES/EN via `src/lib/i18n/translations.ts`. Language selector in Settings.
- **Icons:** lucide-react (no unicode).
- **App tone:** clinical, sober, precise. No blind validation, no diagnoses, no empty motivational phrases. Distinguish fact vs interpretation, thought vs emotion.
- **Terminology:** avoid "analysis" in user-facing text. Use "entries", "result", "reprocess" instead.
- **LLM JSON contract:** defined in `apps/api/app/schemas/llm_response.py`. All LLM output is validated against this schema.
- **Provider layer:** Protocol-based (`providers/base.py`). Provider returns raw string, parsing in service layer.
- **Prompts:** all prompt files in `apps/api/prompts/` are written in English. The LLM is instructed within each prompt to output content in Spanish (Latin American).
- **Background processing:** LLM runs in FastAPI BackgroundTasks. Frontend polls every 3s. Browser notification on completion.
- **Commits:** never include Co-Authored-By or AI attribution.
