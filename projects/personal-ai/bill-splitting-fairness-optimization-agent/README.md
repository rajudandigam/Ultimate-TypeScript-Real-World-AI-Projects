System Type: Agent  
Complexity: Level 3  
Industry: Personal AI / Social finance  
Capabilities: Optimization  

# Bill Splitting & Fairness Optimization Agent

## 🧠 Overview
Helps roommates, trip groups, or couples split **shared expenses** with **transparent fairness rules** (equal, income-weighted, usage-based, rotation) and **edge cases**: someone paid deposit, **partial attendance**, **currency mix**, or **“I only had salad.”** Outputs a **settlement graph** (who pays whom) minimizing transactions, plus a **human-readable audit**—**math layer is deterministic**; the agent explains and negotiates wording.

---

## 🎯 Problem
Splitwise-style apps still confuse people when rules mix; group trips create 20 tiny Venmos; fairness arguments recur.

---

## 💡 Why This Matters
- **Pain it removes:** Social friction and opaque “you owe me” messages.
- **Who benefits:** Shared households, ski trips, and wedding parties.

---

## 🏗️ System Type
**Chosen:** **Single Agent** orchestrating **ledger tools** (add expense, set rule window) and a **solver** that computes **minimal cash flow** settlements.

---

## ⚙️ Complexity Level
**Target:** Level 3 — optimization + messy human inputs + audit trails.

---

## 🏭 Industry
Personal finance / social

---

## 🧩 Capabilities
Optimization, Decision making, Personalization, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Next.js, Node.js, Postgres ledger, FX rates API (mid-market with timestamp), OpenAI SDK for narrative + dispute mediation prompts, Plaid optional (read-only cash flow context, not required), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Bill Splitting & Fairness Optimization Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **personal-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

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
Import expenses (CSV/receipts) → tag participants & splits → **Fairness Agent** proposes rule application → solver → settlement sheet → export to Venmo/PayPal request links (manual confirm)

---

## 🔄 Implementation Steps
1. Equal split + single currency  
2. Itemized restaurant splits with shares  
3. Trip “exclude flight payer from dinners” windows  
4. FX with locked rate date per expense  
5. Dispute flow: agent suggests compromise options with ledger diffs  

---

## 📊 Evaluation
Reduction in number of settlement transactions vs naive pairwise, time-to-group-accept, dispute reopen rate

---

## ⚠️ Challenges & Failure Cases
**Rounding drift** causing cent fights; **mis-tagged payer**; agent suggests unfair gendered defaults—integer cent resolution rules, immutable edit log, neutral templates, human lock on rule changes

---

## 🏭 Production Considerations
Not a bank—clear regulatory positioning, optional E2EE for sensitive notes, export for tax prep (user responsibility disclaimer)

---

## 🚀 Possible Extensions
Recurring rent + utilities templates with automatic meter reading photo parse

---

## 🔁 Evolution Path
Spreadsheet → structured ledger → agent-explained settlements → optional bank feed enrichment with strict consent

---

## 🤖 Agent breakdown
- **Classifier pass:** maps messy text (“I got groceries again”) to structured expense rows with confidence.  
- **Policy interpreter:** applies active rule pack for the date range.  
- **Solver tool:** min-cash-flow graph algorithm in TS (deterministic).  
- **Explainer pass:** narrates settlements with per-line citations to ledger IDs.

---

## 🎓 What You Learn
Settlement optimization, audit-first social fintech UX, keeping LLMs away from the money math
