System Type: Agent  
Complexity: Level 3  
Industry: Fintech  
Capabilities: Optimization, Tracking  

# Cryptocurrency Portfolio Manager

## 🧠 Overview
A **read-heavy portfolio agent** that aggregates **on-chain and exchange balances** via APIs, tracks **cost basis** inputs you supply (or CSV), and suggests **rebalance drafts** with **tax-awareness flags** (wash sale / lot selection heuristics as **non-legal** hints)—**never** custodies keys in the LLM; use **vault/HSM** or **read-only** keys per security model.

---

## 🎯 Problem
Users hold assets across chains and CEXs; tax and allocation drift are painful. LLM must not invent balances.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `list_positions`, `fetch_prices`, `propose_rebalance` (validated).

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-chain reads + memory of user preferences.

---

## 🏭 Industry
Fintech / crypto portfolio tooling.

---

## 🧩 Capabilities
Optimization, Tracking, Personalization, Observability.

---

## 🛠️ Suggested TypeScript Stack
**viem**/**ethers**, exchange REST, **Postgres**, **Node.js**, **OpenAI SDK** for explanations only.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Cryptocurrency Portfolio Manager** (Agent, L3): prioritize components that match **agent** orchestration and the **fintech** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Stripe / payment processor APIs
- Plaid or bank aggregation (if permitted)
- Core ledger / accounting webhooks

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
Wallet connectors (read) + CEX OAuth → balance aggregator → agent → UI; optional signing in **client** or **custodial** service outside LLM.

---

## 🔄 Implementation Steps
Manual CSV → CEX read-only → chain reads → price oracle → rebalance math in code → agent narrates.

---

## 📊 Evaluation
Balance accuracy vs explorers, tax export correctness on fixtures, user edits to proposals.

---

## ⚠️ Challenges & Failure Cases
**Wrong chain** selection; oracle stale; **key leak** if mishandled—use vault patterns. Regulatory uncertainty—geo block. RPC rate limits.

---

## 🏭 Production Considerations
Secrets, audit, region locks, ToS for data providers, incident response for key compromise, no seed phrases in logs.

---

## 🚀 Possible Extensions
DeFi position decoding, staking rewards, tax software CSV export.

---

## 🔁 Evolution Path
Read-only dashboard → suggestions → signed txs via dedicated signer service (not LLM).

---

## 🎓 What You Learn
Multi-chain integration, separating signing from reasoning, portfolio UX safety.
