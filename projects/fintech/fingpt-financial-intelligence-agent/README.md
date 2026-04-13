System Type: Agent  
Complexity: Level 4  
Industry: Fintech  
Capabilities: Prediction, Sentiment  

# FinGPT Financial Intelligence Agent

## 🧠 Overview
A **market intelligence agent** that combines **licensed market data tools** (prices, volumes, fundamentals) with **sentiment signals** (news/RSS/social where ToS allows) to produce **structured briefs**—**not** trade signals unless you add licensed execution and disclaimers. Numbers and indicators must come from **tool outputs**, not model recall.

---

## 🎯 Problem
Retail and prosumers drown in feeds; raw LLM “analysis” invents tickers and levels. You need **data contracts**, **citations**, and **risk disclosures**.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `fetch_quote`, `fetch_candles`, `fetch_news_headlines`, `compute_indicator` (server-side TA lib).

---

## ⚙️ Complexity Level
**Target:** Level 4. Multi-source retrieval + indicators + evaluation harness.

---

## 🏭 Industry
Fintech / market data / research copilots.

---

## 🧩 Capabilities
Prediction (scenario-style, not promises), Sentiment, Retrieval, Reasoning, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, market data APIs, **TA-Lib** or similar in worker, **Postgres** cache, **OpenAI SDK**, **OpenTelemetry**.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **FinGPT Financial Intelligence Agent** (Agent, L4): prioritize components that match **agent** orchestration and the **fintech** integration surface.

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
BFF → agent → data vendor adapters → brief composer → UI; scheduled digest jobs optional.

---

## 🔄 Implementation Steps
Quotes-only bot → add news retrieval → add indicators server-side → add structured “bull/bear factors” from tool JSON → compliance review.

---

## 📊 Evaluation
Factuality vs reference data, latency, cost per brief, user trust surveys, incident rate of wrong symbols.

---

## ⚠️ Challenges & Failure Cases
**Hallucinated** prices—block without `asof` timestamps from tools. Vendor outages—stale banners. **Latency**—parallel tools with caps. **Cost**—cache candles. **Incorrect** “buy now” language—policy engine + disclaimers.

---

## 🏭 Production Considerations
Data licensing, rate limits, audit logs, no investment advice disclaimers, prompt injection via headlines (sanitize), regional regulations.

---

## 🚀 Possible Extensions
Portfolio link read-only, alerting, PDF research export.

---

## 🔁 Evolution Path
Summaries → tool-grounded analysis → optional paper trading integration (separate licensed scope).

---

## 🎓 What You Learn
Market data integration, indicator computation outside LLMs, compliance UX for finance AI.
