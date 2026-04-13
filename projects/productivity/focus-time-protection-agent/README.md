System Type: Agent  
Complexity: Level 2  
Industry: Productivity  
Capabilities: Automation  

# Focus Time Protection Agent

## 🧠 Overview
A **policy-driven agent** that coordinates **calendar holds**, **Slack/Teams DND**, **notification batching**, and optional **site/app blocklists** (OS-dependent) to **protect deep work**—user sets **intent and windows**; the agent uses tools to **apply** and **restore** states, with **explicit opt-in** and **emergency override** paths.

---

## 🎯 Problem
Context switching destroys deep work; manual “do not disturb” is forgotten or socially costly without transparent signals.

---

## 💡 Why This Matters
- **Pain it removes:** Interruptions during focus blocks and guilt about appearing “away.”
- **Who benefits:** Engineers, writers, and analysts in chat-heavy organizations.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Short planning loop selects which integrations to toggle; execution is idempotent tool calls with rollback timers.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Integrations + simple policies; L3+ adds adaptive scheduling from meeting patterns and team norms RAG.

---

## 🏭 Industry
Example:
- Productivity / workplace wellbeing (tooling)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional team focus policy docs
- Planning — bounded (when to start/stop protection)
- Reasoning — bounded (conflict with mandatory meetings)
- Automation — **in scope**
- Decision making — bounded (defer vs block notifications)
- Observability — **in scope**
- Personalization — user focus templates
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** worker + cron
- **Slack API** / **Microsoft Graph** presence + calendar
- **Google Calendar API**
- **OpenAI SDK** optional for NL scheduling of focus blocks
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Focus Time Protection Agent** (Agent, L2): prioritize components that match **agent** orchestration and the **productivity** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Gmail / Microsoft Graph mail & calendar
- Slack / Teams webhooks & bot APIs
- Notion / Jira / Linear REST

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo.
- **Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it.
- **Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** “Focus for 90m”, recurring rules, allowlist contacts.
- **LLM layer:** Parses natural language intents into structured schedules (validated).
- **Tools / APIs:** Calendar busy holds, chat DND, notification router hooks.
- **Memory (if any):** User policy objects; audit of applied states.
- **Output:** Confirmation + visible status message to teammates (optional).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual button toggles DND via one integration.

### Step 2: Add AI layer
- NL parses duration and creates calendar block draft.

### Step 3: Add tools
- Multi-integration apply with compensating transactions on timer end.

### Step 4: Add memory or context
- Learn typical focus windows; suggest proactively (opt-in).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional “team coordinator” agent avoids overlapping team-wide quiet hours conflicts.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Correct apply/restore pairs; zero missed restores in pilots.
- **Latency:** Time from command to DND active.
- **Cost:** API calls + negligible LLM if used sparingly.
- **User satisfaction:** Self-reported focus score; fewer interruptions logged.
- **Failure rate:** Stuck DND after crash, wrong calendar, social backlash from opaque blocking.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong meeting skipped; always cross-check mandatory meetings via calendar tool.
- **Tool failures:** Token expiry mid-focus; watchdog restores safe defaults.
- **Latency issues:** Chat API slow; queue state locally and reconcile.
- **Cost spikes:** Frequent LLM calls; prefer structured UI for recurring rules.
- **Incorrect decisions:** Blocking emergency pages; allowlist on-call routes and break-glass.

---

## 🏭 Production Considerations

- **Logging and tracing:** State transition audit; minimize sensitive message content in logs.
- **Observability:** Restore failures, override usage counts, integration health.
- **Rate limiting:** Chat API quotas; backoff and user-visible errors.
- **Retry strategies:** Idempotent “set presence” operations with desired-state reconciliation.
- **Guardrails and validation:** Never block security/compliance channels without explicit policy.
- **Security considerations:** OAuth scopes minimal; enterprise key custody; MDM policies for OS-level controls.

---

## 🚀 Possible Extensions

- **Add UI:** Focus timer with gentle wind-down notifications.
- **Convert to SaaS:** Team focus analytics (privacy-preserving aggregates only).
- **Add multi-agent collaboration:** Manager visibility agent with transparency controls.
- **Add real-time capabilities:** Auto-pause focus when incident declared (PagerDuty webhook).
- **Integrate with external systems:** Clockwise, Reclaim.ai-style auto moves (careful IP).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **transparent** status signals before aggressive blocking.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Presence and calendar** API choreography
  - **Compensating transactions** for user state
  - **Opt-in automation** UX
  - **System design thinking** for humane productivity tooling
