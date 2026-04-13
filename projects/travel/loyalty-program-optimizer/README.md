System Type: Agent  
Complexity: Level 2  
Industry: Travel  
Capabilities: Optimization  

# Loyalty Program Optimizer

## 🧠 Overview
A **lightweight agent** (or agent-shaped workflow) that **aggregates** balances and expiry dates across airline, hotel, and card-linked programs, then **recommends** redemptions and earning shifts using **deterministic math** for value-per-point plus **LLM narration** for tradeoffs—explicitly **not** financial advice and always showing **assumptions** (CPP ranges, transfer bonuses).

---

## 🎯 Problem
Points sprawl across programs with opaque transfer charts and expiring miles. Spreadsheets are tedious; naive chatbots invent valuations. You need **data ingestion + optimization** with **auditable** numbers the user can sanity-check.

---

## 💡 Why This Matters
- **Pain it removes:** Wasted points, missed transfer bonuses, and last-minute panic redemptions.
- **Who benefits:** Frequent flyers, travel hackers (within ToS), and fintech apps adding “points desk” features.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The system is primarily **read connectors + scoring**; the LLM packages results and answers “what if” questions **without** replacing the optimizer’s numbers.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Tool calls to balances and static award charts, simple scoring, and clear UX—not yet deep personalization or compliance-heavy wealth advice.

---

## 🏭 Industry
Example:
- Travel (loyalty, awards, points ecosystems)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (program FAQ snippets, deval notices)
- Planning — bounded (burn plan over next N months)
- Reasoning — bounded (explain tradeoffs)
- Automation — optional (alerts before expiry)
- Decision making — bounded (rank options; user chooses)
- Observability — **in scope**
- Personalization — light (home airport, cabin preference)
- Multimodal — optional (screenshot of statement—OCR pipeline, not raw LLM guess)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React**
- **Node.js + TypeScript**
- **Postgres** (linked accounts metadata, cached balances)
- **Plaid-style** or partner APIs where available; otherwise manual CSV import
- **OpenAI SDK** (explain optimizer output JSON)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Loyalty Program Optimizer** (Agent, L2): prioritize components that match **agent** orchestration and the **travel** integration surface.

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

- **Input (UI / API / CLI):** OAuth or secure import, traveler preferences, target trips.
- **LLM layer:** Agent explains `OptimizationResult` objects produced by code.
- **Tools / APIs:** Balance fetchers, award search proxies, transfer partner tables (versioned JSON).
- **Memory (if any):** User goals (“Japan in spring”) as structured fields, not only prose.
- **Output:** Ranked redemption paths, calendar reminders, exportable plan.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static valuation table + spreadsheet-like UI.

### Step 2: Add AI layer
- LLM narrates a single optimal path from JSON the code computed.

### Step 3: Add tools
- Add connectors or file parsers for each program’s export format.

### Step 4: Add memory or context
- Remember dismissed options and user’s CPP assumptions.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional separate “deal watcher” cron—not a second chat agent unless product needs it.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Match human expert plans on labeled scenarios; valuation error bounds disclosed.
- **Latency:** p95 time to refresh balances and recompute.
- **Cost:** Near-zero LLM cost if explanations are short; monitor if users spam long chats.
- **User satisfaction:** Saves vs baseline behavior, qualitative trust.
- **Failure rate:** Stale balances, wrong program mapping, misleading “best” claims.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented transfer ratios; mitigated by versioned tables in code/DB only.
- **Tool failures:** Scraping breakage when sites change; mitigated by official APIs, user refresh prompts.
- **Latency issues:** Sequential fetches across many programs; mitigated by parallel requests with caps.
- **Cost spikes:** Long dialog replanning every turn; mitigated by recomputing only when inputs change.
- **Incorrect decisions:** Suggesting violations of program ToS; mitigated by policy disclaimers and conservative rules.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log connector errors, not raw account numbers.
- **Observability:** Staleness of each integration, user-reported wrong balances.
- **Rate limiting:** Per user refresh cadence; backoff on partner APIs.
- **Retry strategies:** Exponential backoff; circuit breakers per connector.
- **Guardrails and validation:** Disclaimers; block “manufactured spending” coaching if product policy forbids; regional compliance for financial promotions.
- **Security considerations:** Encrypt tokens, minimize stored credentials, SOC2 basics for account linking.

---

## 🚀 Possible Extensions

- **Add UI:** Interactive what-if sliders for CPP and cabin.
- **Convert to SaaS:** Team plans for family pooling scenarios.
- **Add multi-agent collaboration:** Separate “award flight search” agent with heavy tools (optional).
- **Add real-time capabilities:** Web push when transfer bonus appears.
- **Integrate with external systems:** Award search APIs, credit card issuer APIs where licensed.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep **optimization in code**; let the model explain and explore scenarios.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Separation** of optimization logic and LLM prose
  - **Fragile integrations** in loyalty ecosystems
  - **Transparent assumptions** in recommender UX
  - **System design thinking** for consumer finance-adjacent travel
