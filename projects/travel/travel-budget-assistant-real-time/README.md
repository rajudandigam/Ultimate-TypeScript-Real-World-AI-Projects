System Type: Agent  
Complexity: Level 2  
Industry: Travel  
Capabilities: Tracking, Personalization  

# Travel Budget Assistant (Real-Time)

## 🧠 Overview
A **lightweight in-trip agent** that **tracks** expenses against a per-trip budget using **structured entries** (receipt OCR, card feed categorization, manual quick-add), and **nudges** travelers with **personalized** pacing (“you are ahead/behind for day 3 of 7”)—grounding amounts in **ledger rows**, not model guesses.

---

## 🎯 Problem
Travelers overspend early or discover budget blowouts after return. Spreadsheets are friction; chat-only assistants invent totals. You need **fast categorization**, **FX handling**, and **clear receipts** for what was counted.

---

## 💡 Why This Matters
- **Pain it removes:** Anxiety spend, surprise overages, and weak visibility for shared trips.
- **Who benefits:** Leisure travelers, small teams, and travel apps embedding simple budgets.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One agent reads **ledger tools** and explains variances; ingestion can be **workflow-driven** (OCR jobs) behind the scenes.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Tool usage for CRUD on expenses, simple rules for pacing alerts, minimal personalization—L3+ adds richer memory and multi-user splits.

---

## 🏭 Industry
Example:
- Travel (trip budgeting, expense awareness—not full corporate T&E without extensions)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (tips from curated destination cost guides)
- Planning — light (daily spend pacing)
- Reasoning — bounded (explain category shifts)
- Automation — optional (push notifications)
- Decision making — bounded (suggest cutbacks, not financial advice)
- Observability — **in scope**
- Personalization — **in scope** (trip style presets: budget / comfort / splurge)
- Multimodal — optional (receipt photo → OCR pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **React Native / Next.js**
- **Node.js + TypeScript**
- **Postgres** (trips, ledger lines, FX rates cache)
- **Plaid** / **card CSV import** (where appropriate)
- **OpenAI SDK** (categorization + coaching tone from structured totals)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Travel Budget Assistant (Real-Time)** (Agent, L2): prioritize components that match **agent** orchestration and the **travel** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Duffel / Amadeus / airline NDC (availability-dependent)
- Google Places & Routes or Mapbox (routing, POI hours)
- Weather APIs for outdoor risk

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

- **Input (UI / API / CLI):** Quick add, receipt capture, bank sync webhooks.
- **LLM layer:** Agent classifies merchant text and explains pacing vs plan JSON.
- **Tools / APIs:** `add_expense`, `list_by_day`, `set_budget`, `fx_convert`, notification push.
- **Memory (if any):** Trip preset and per-category caps; optional user defaults across trips.
- **Output:** Live dashboard, daily digest messages, end-of-trip summary export.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual ledger + charts; no AI.

### Step 2: Add AI layer
- LLM maps free-text “dinner 45 eur” into structured rows with validation.

### Step 3: Add tools
- Add OCR worker that returns JSON lines for agent confirmation.

### Step 4: Add memory or context
- Remember user category preferences and common merchants.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional split: ingestion classifier vs chat agent (same product, two services).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Categorization accuracy vs labeled receipts; FX correctness vs reference rates.
- **Latency:** p95 time from receipt photo to confirmed row.
- **Cost:** Tokens per trip; OCR costs.
- **User satisfaction:** Reduced surprise at trip end; qualitative ease.
- **Failure rate:** Double-counted expenses, wrong currency, missing shared-trip splits.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong totals in chat; mitigated by always rendering numbers from DB in UI, agent references row IDs only.
- **Tool failures:** Bank sync delays; mitigated by stale banners and manual override.
- **Latency issues:** OCR backlog; mitigated by async jobs + optimistic UI with pending state.
- **Cost spikes:** Re-classifying entire history each message; mitigated by hashing unchanged rows.
- **Incorrect decisions:** Bad advice that feels like regulated financial advice; mitigated by disclaimers, no investment guidance, and clear “estimates only” copy.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log categorization confidence, not full card PAN; PCI scope minimization.
- **Observability:** Sync lag, OCR failure rate, notification spam complaints.
- **Rate limiting:** Per user uploads; fraud checks on referral abuse if credits exist.
- **Retry strategies:** Idempotent webhook processing; dedupe on bank transaction IDs.
- **Guardrails and validation:** Max daily notify cap; block offensive receipt content; GDPR deletion for trips.
- **Security considerations:** Encrypt at rest, least privilege API keys, optional local-only mode for privacy-focused users.

---

## 🚀 Possible Extensions

- **Add UI:** Split bills between travelers with settle-up math.
- **Convert to SaaS:** Teams with policy caps and manager visibility.
- **Add multi-agent collaboration:** Optional “group trip mediator” for shared budgets (becomes L4 scope).
- **Add real-time capabilities:** Live location-based spend tips (consent-heavy).
- **Integrate with external systems:** Full Concur / Expensify export paths (enterprise).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **ledger correctness** before any automated bank actions.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Event-sourced** expense modeling
  - **FX and rounding** pitfalls
  - **Grounding** numeric assistants in databases
  - **System design thinking** for mobile-first money UX
