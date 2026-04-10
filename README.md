# MindLens

**A local tool for understanding what you think and why you think it.**

This is a personal project I decided to share.
I was already doing CBT exercises on paper, but I wanted a more comfortable and structured way to work through them — something that could keep a history, help me notice patterns over time, and make use of modern AI tools to support the process when useful.

This isn't meant to be a professional tool or a polished product.
It's simply a practical, visual way to do the exercises.

You do the work — the tool helps you see it more clearly.

MindLens is not a therapy chatbot, not a journal, not a motivational coach. It's a **cognitive lens**: it helps you look at your thoughts more clearly, question them, and uncover the distortions and underlying beliefs shaping how you feel and react. Instead of telling you what to think, it shows you how your thinking works.

It uses AI models that run **100% on your machine** (via [Ollama](https://ollama.com)) — nothing leaves your computer. Your data stays in a local SQLite file. No accounts, no servers, no telemetry.

> **Disclaimer:** MindLens is a self-exploration tool based on Cognitive Behavioral Therapy (CBT) concepts. It is not a professional or clinical tool in any way. It does not replace professional mental health care. If you are going through a crisis, please seek professional help.

---

## What it does

### ABC Exercise

The primary entry point. A step-by-step guided cognitive restructuring exercise based on Albert Ellis' model:

| Step | What it is |
|------|-----------|
| **A** — Activating Event | What objectively happened |
| **B** — Belief | What you automatically thought |
| **C** — Consequence | How you felt and what you did |
| **D** — Disputation | Challenging the belief as a hypothesis |
| **E** — Effective New Belief | A more balanced thought |
| **F** — New Feeling | How you'd feel with that new belief |

On steps D and E you can ask the AI for a brief observation to help you think. But the idea is that you do the work first.

When you complete the exercise, the AI processes your input in the background and generates a structured cognitive result.

### AI-powered cognitive result

After completing an exercise, the AI returns a structured breakdown:

- **Summary** of what you described, with detected pattern tags
- **Emotions** detected with intensity (1-10)
- **Cognitive distortions** identified with evidence and confidence level
- **Reframe** — a more balanced alternative thought (prominently displayed)
- **ABC Model** — the cognitive process: trigger → automatic thought → emotional result
- **Maintenance cycle** — how the pattern sustains itself (avoidance, rumination, etc.)
- **Suggested exercises** — concrete next steps (behavioral experiments, exposure, etc.)
- **Deep beliefs** — core beliefs and intermediate rules (collapsible, when detected)

### Learn section

A built-in guide that explains CBT fundamentals in plain language: what it is, why it works, how the ABC model connects situations to emotions, what cognitive distortions are, and how the exercise helps you intervene. Designed so anyone can understand it without prior knowledge.

### Dashboard and patterns

The dashboard shows stats from your entries: how many you've completed, your most frequent distortions, and the emotions that come up most often. This lets you spot recurring patterns over time.

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
git clone https://github.com/GabrieleBattiato/mindlens.git
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

### 3. Configure (optional)

```bash
cp .env.example apps/api/.env
```

Edit `apps/api/.env` if you want to change the model, Ollama URL, or other settings. Without this file, defaults are used.

### 4. API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4000
```

### 5. Web

```bash
cd apps/web
npm install
npm run build
npm start -- --port 4001
```

### 6. Open the app

Go to [http://localhost:4001](http://localhost:4001)

---

## Configuration

By default MindLens connects to Ollama at `http://localhost:11434` with the `qwen3:8b` model. You can change this from the **Settings** page in the app, or by creating a `.env` file in `apps/api/` based on `.env.example`:

```bash
CBD_OLLAMA_BASE_URL=http://localhost:11434
CBD_OLLAMA_MODEL=qwen3:8b
CBD_LLM_TEMPERATURE=0.3
CBD_LLM_MAX_TOKENS=8192
CBD_DATABASE_URL=sqlite:///./mindlens.db
```

### Compatible models

Any model that runs on Ollama should work. The quality of the result depends on the model — larger models (13B+) tend to produce more precise and nuanced output.

---

## Languages

The interface is available in **Spanish** and **English**. You can switch languages from the **Settings** page. AI output is generated in the language you have selected.

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
└── .env.example
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
| **Reframe** | An alternative thought that doesn't deny what you feel, but looks at it from a more balanced, evidence-based angle. |
| **Core belief** | A deep belief about yourself, others, or the world (e.g., "I'm not enough", "people will reject me"). It doesn't always appear — only when detected. |
| **Maintenance cycle** | The mechanism by which a pattern sustains itself over time: avoidance, rumination, reassurance seeking, etc. |
| **Disputation (D)** | Challenging a belief as if it were a hypothesis: looking for evidence for and against, considering other explanations. |

---

## License

[MIT](./LICENSE)
