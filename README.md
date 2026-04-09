# MindLens

**A local tool for understanding what you think and why you think it.**

MindLens is not a therapy chatbot, not a journal, not a motivational coach. It's a **cognitive lens**: It helps you look at your thoughts more clearly, question them, and uncover the distortions and underlying beliefs shaping how you feel and react. Instead of telling you what to think, it shows you how your thinking works.

It uses AI models that run **100% on your machine** (via [Ollama](https://ollama.com)) — nothing leaves your computer. Your data stays in a local SQLite file. No accounts, no servers, no telemetry.

> **Disclaimer:** MindLens is a self-exploration tool based on Cognitive Behavioral Therapy (CBT) concepts. It does not replace professional mental health care. If you are going through a crisis, please seek professional help.

---

## What it does

### AI-powered cognitive analysis

Describe a situation that affected you — as free text or through a guided form (situation, thoughts, emotions, intensity, behavior) — and the AI returns a structured analysis:

- **Clinical summary** of what you described
- **Emotions** detected with intensity (1-10)
- **Cognitive distortions** identified with evidence and confidence level
- **ABC Model** (Activating Event → Belief → Consequence)
- **Fact vs Interpretation** — what's observable vs what's an assumption
- **Reframe** — a more balanced alternative thought
- **Belief analysis** — core beliefs and intermediate rules (when applicable)
- **Maintenance cycle** — how the pattern sustains itself (avoidance, rumination, etc.)
- **Suggested CBT exercises** — concrete steps to work on what was found

### ABC Exercise

A step-by-step guided cognitive restructuring exercise, based on Albert Ellis' model:

| Step | What it is |
|------|-----------|
| **A** — Activating Event | What objectively happened |
| **B** — Belief | What you automatically thought |
| **C** — Consequence | How you felt and what you did |
| **D** — Disputation | Challenging the belief as a hypothesis |
| **E** — Effective New Belief | A more balanced thought |
| **F** — New Feeling | How you'd feel with that new belief |

On steps D and E you can ask the AI for help: it generates Socratic questions, identifies distortions, and suggests disputations or alternative beliefs. But the idea is that you do the work first.

### Learn section

A built-in guide that explains CBT fundamentals in plain language: what it is, why it works, how the ABC model connects situations to emotions, what cognitive distortions are, and how the ABC exercise helps you intervene. Designed so anyone can understand it without prior knowledge.

### Dashboard and patterns

The dashboard shows stats from your analyses: how many you've done, your most frequent distortions, and the emotions that come up most often. This lets you spot recurring patterns over time.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | FastAPI, Python 3.11+, SQLAlchemy 2.0, Pydantic v2 |
| Database | SQLite (local) |
| AI | Ollama (local) — default: `qwen3:8b` |

---

## Requirements

- **Python 3.11+**
- **Node.js 18+**
- **Ollama** installed and running ([instructions](https://ollama.com/download))

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mindlens.git
cd mindlens
```

### 2. Install and run Ollama

```bash
# Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Start the server
ollama serve

# Download the model (in another terminal)
ollama pull qwen3:8b
```

### 3. Start the app

```bash
./dev.sh
```

This script installs dependencies and starts both the API (port 8000) and the web app (port 3000) in a single command.

<details>
<summary>Manual setup (alternative)</summary>

```bash
# API
cd apps/api
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web (separate terminal)
cd apps/web
npm install
npm run dev
```

</details>

### 4. Open the app

Go to [http://localhost:3000](http://localhost:3000)

---

## Configuration

By default MindLens connects to Ollama at `http://localhost:11434` with the `qwen3:8b` model. You can change this from the **Settings** page in the app, or by creating a `.env` file in `apps/api/` based on `.env.example`:

```bash
CBD_OLLAMA_BASE_URL=http://localhost:11434
CBD_OLLAMA_MODEL=qwen3:8b
CBD_LLM_TEMPERATURE=0.3
CBD_LLM_MAX_TOKENS=4096
CBD_DATABASE_URL=sqlite:///./mindlens.db
```

### Compatible models

Any model that runs on Ollama should work.
Larger models (13B+) need more RAM/VRAM but tend to produce more precise results.

---

## Languages

The interface is available in **Spanish** and **English**. You can switch languages from the **Settings** page. AI analysis output is always generated in Spanish.

---

## Project structure

```
mindlens/
├── apps/
│   ├── api/                     # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py          # App entrypoint
│   │   │   ├── config.py        # Settings (pydantic-settings)
│   │   │   ├── database.py      # SQLAlchemy async setup
│   │   │   ├── models/          # ORM models (Analysis, Exercise)
│   │   │   ├── schemas/         # Pydantic schemas + LLM response contract
│   │   │   ├── routers/         # API endpoints
│   │   │   ├── services/        # Business logic
│   │   │   └── providers/       # LLM provider layer (Ollama)
│   │   ├── prompts/             # System/user prompt templates for the LLM
│   │   └── requirements.txt
│   └── web/                     # Next.js frontend
│       ├── src/
│       │   ├── app/             # Pages (App Router)
│       │   ├── components/      # UI components
│       │   └── lib/             # API client, types, i18n, utils
│       └── package.json
├── .env.example
└── dev.sh                       # Script to start both apps
```

---

## Privacy

- Everything runs on your machine. The AI is a local model via Ollama.
- Data is stored in a local SQLite file (`mindlens.db`).
- No authentication, no external servers, no tracking.
- If you delete the database, everything is gone. There is no remote backup.

---

## Key concepts

If this is your first time with Cognitive Behavioral Therapy, here's a quick glossary of what you'll find in the app:

| Concept | What it means |
|---------|--------------|
| **Cognitive distortion** | An automatic thinking pattern that distorts how you interpret reality. It's not an "error" — it's a mental shortcut we all have, but that sometimes works against us. Examples: all-or-nothing thinking, catastrophizing, mind reading. |
| **ABC Model** | Albert Ellis' model: **A** (activating event) → **B** (belief/thought) → **C** (emotional/behavioral consequence). The core idea is that it's not the situation that generates the emotion, but what you think about it. |
| **Fact vs Interpretation** | Separating what objectively happened (what a camera would record) from what you assumed, inferred, or interpreted. |
| **Reframe** | An alternative thought that doesn't deny what you feel, but looks at it from a more balanced, evidence-based angle. |
| **Core belief** | A deep belief about yourself, others, or the world (e.g., "I'm not enough", "people will reject me"). It doesn't always appear — only when the analysis detects it. |
| **Maintenance cycle** | The mechanism by which a pattern sustains itself over time: avoidance, rumination, reassurance seeking, etc. |
| **Disputation (D)** | Challenging a belief as if it were a hypothesis: looking for evidence for and against, considering other explanations. |

---

## License

[MIT](./LICENSE)
