System Type: Agent  
Complexity: Level 3  
Industry: Maritime / Supply Chain  
Capabilities: Prediction, Analysis  

# Port Congestion Prediction Agent

## 🧠 Overview
Fuses **AIS vessel movements**, **terminal berth calendars** (where available), **queue lengths proxies**, and **weather/port strike news** to forecast **ETA slippage and dwell risk** at major hubs—surfaces **actionable alerts** to planners (“reroute via secondary port”) with **confidence intervals**, not single magic ETAs.

---

## 🎯 Problem
JIT schedules break when ports clog; freight teams learn too late from headlines, not signals.

---

## 💡 Why This Matters
- **Pain it removes:** Demurrage surprises and factory line stoppages from missing components.
- **Who benefits:** Ocean freight buyers, manufacturers, and 4PL control towers.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **SQL/feature tools** and **news RAG**; core forecasts from **gradient boosted / temporal** models trained offline.

---

## ⚙️ Complexity Level
**Target:** Level 3 — messy geospatial time series + narrative explanation layer.

---

## 🏭 Industry
Logistics / maritime intelligence

---

## 🧩 Capabilities
Prediction, Analysis, Retrieval, Observability, Decision making

---

## 🛠️ Suggested TypeScript Stack
Node.js, AIS stream (Spire/Kpler APIs as licensed), Postgres + PostGIS, BigQuery feature store, dbt, OpenAI SDK for analyst briefings, Grafana, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Port Congestion Prediction Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **logistics-ai** integration surface.

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
AIS ingest → anchorage clustering → dwell features → model scores → **Port Agent** composes port-level risk digest → webhook to TMS → human feedback labels loop

---

## 🔄 Implementation Steps
1. Top-10 ports baseline with historical dwell distributions  
2. Berth-level features when terminal data partners exist  
3. Weather/river closure overlays  
4. Disruption taxonomy from news with human-labeled seeds  
5. Shippers-specific lane watchlists  

---

## 📊 Evaluation
CRPS or quantile loss on dwell, lead time for alerts vs realized congestion, $ impact of reroute suggestions (pilot A/B)

---

## ⚠️ Challenges & Failure Cases
**AIS spoofing**; sparse AIS in some regions; **confusing anchorage with congestion**—robust clustering, cross-check with terminal APIs, show data quality score per prediction

---

## 🏭 Production Considerations
API licensing costs, territorial AIS restrictions, embargo/sanctions screening on vessels, responsible disclosure when inferring sensitive military traffic—geo-fenced exclusions

---

## 🚀 Possible Extensions
Rail drayage congestion add-on from intermodal yard trackers

---

## 🤖 Agent breakdown
- **Feature builder tools:** assemble rolling counts, queue proxies, seasonality.  
- **Model scorer (service):** returns quantiles; not LLM.  
- **Analyst agent:** reads scores + news snippets to produce customer-facing brief with citations.

---

## 🎓 What You Learn
Maritime AIS analytics, uncertainty communication, ops research for supply chains
