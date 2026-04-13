System Type: Agent  
Complexity: Level 3  
Industry: Logistics  
Capabilities: Prediction  

# Demand Forecasting Agent

## 🧠 Overview
Forecasts **SKU/location demand** by querying **warehouse sales history**, **promotions**, and **seasonality features** via tools—combines **statistical baseline** (ETS/Prophet-style or precomputed cubes) with **LLM explanations** and **anomaly flags** for planners; **numbers from models/code**, not LLM arithmetic.

---

## 🎯 Problem
Stockouts and overstocks hurt margin; spreadsheet forecasts break when assortment changes quickly.

---

## 💡 Why This Matters
Better **inventory positioning** and **S&OP** alignment across channels.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over warehouse + forecast service APIs.

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Supply chain / retail & CPG

---

## 🧩 Capabilities
Prediction, Retrieval, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Snowflake/BigQuery, dbt marts, Python forecast microservice optional, OpenAI SDK, Postgres forecast registry, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Demand Forecasting Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **logistics** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Maps / distance-matrix APIs
- TMS / carrier webhooks
- ERP or WMS export APIs where relevant

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
ETL marts → forecast engine API → agent explains drivers & recommends overrides → export to ERP/APS

---

## 🔄 Implementation Steps
Baseline ARIMA/seasonal naive → add promo calendar tool → agent narrative → planner feedback loop → automated publish to low-risk SKUs (policy)

---

## 📊 Evaluation
WAPE/MAPE vs holdout, inventory turns, stockout rate, planner override rate

---

## ⚠️ Challenges & Failure Cases
Cold-start SKUs; promotion cannibalization; LLM confabulating growth rates; data lag—use hierarchical reconciliation, uncertainty intervals, governance on auto-orders

---

## 🏭 Production Considerations
RLS in warehouse, versioned forecasts, audit for PO impacts, cost caps on queries

---

## 🚀 Possible Extensions
New product analogous mapping, multi-echelon inventory hints

---

## 🔁 Evolution Path
Static models → tool-backed agent narratives → closed-loop replenishment tie-in

---

## 🎓 What You Learn
S&OP data contracts, forecast governance, safe copilots for planners
