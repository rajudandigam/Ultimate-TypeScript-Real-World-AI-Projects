System Type: Agent  
Complexity: Level 4  
Industry: Climate / Risk  
Capabilities: Simulation, Prediction  

# Climate Risk Scenario Simulation Agent

## 🧠 Overview
Helps **risk and resilience teams** stress-test **sites and supply chains** under **climate scenarios** (pluvial flood, riverine flood, heat stress, wind)—combines **hazard layers** (licensed models/APIs), **asset exposure**, and **business continuity data** to produce **quantified exposure bands** and **mitigation option cards**—**not** a replacement for certified engineering studies; outputs are **decision support** with **cited sources**.

*Catalog note:* Distinct from **`Climate & Sustainability Intelligence Agent`** (operational **carbon/ESG analytics**). This project is **physical hazard scenario** exploration for **continuity and capex**.

---

## 🎯 Problem
Boards ask “what if” questions; spreadsheets cannot fuse geospatial hazard with SKU-level supply nodes; insurance asks for coherent narratives.

---

## 💡 Why This Matters
- **Pain it removes:** Opaque climate risk in capex and insurance renewals.
- **Who benefits:** CFO office, resilience leads, and infrastructure PMs.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **simulation + GIS tools**; hazard math from **approved datasets**, not LLM invention.

---

## ⚙️ Complexity Level
**Target:** Level 4 — geospatial joins, uncertainty, and multi-stakeholder reporting.

---

## 🏭 Industry
Climate risk / enterprise resilience

---

## 🧩 Capabilities
Simulation, Prediction, Planning, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, PostGIS, raster tile services (STAC/COG), FEMA/USGS or commercial hazard APIs (licensed), BigQuery for asset tables, OpenAI SDK for narrative on **numeric outputs only**, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Climate Risk Scenario Simulation Agent** (Agent, L4): prioritize components that match **agent** orchestration and the **climate-ai** integration surface.

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
Asset registry + geocode → **Scenario Agent** pulls hazard layers for RCP/SSP selections → exposure compute → mitigation library match → PDF/BI export with assumptions sheet

---

## 🔄 Implementation Steps
1. Single-site flood depth binning MVP  
2. Supply chain graph + multi-hop supplier sites  
3. Heat downtime hours for data center PUE sensitivity  
4. Capex optioneering (raise gens, relocate SKU) as structured cards  
5. Versioned scenario packs for audit replay  

---

## 📊 Evaluation
Calibration vs historical events where available, scenario runtime, executive trust score, % mitigations adopted in pilots

---

## ⚠️ Failure Scenarios
**Outdated hazard layers**; **geocode errors** shift site into wrong cell; **overconfident single numbers**—confidence intervals, source vintages on every map, “engage licensed engineer” flags for structural design

---

## 🤖 Agent breakdown
- **GIS tools:** spatial joins, depth-duration metrics, aggregation by asset class.  
- **Scenario composer:** selects parameters from org-approved scenario library.  
- **Narrator agent:** writes exec summary strictly from tool JSON + hazard metadata IDs.

---

## 🎓 What You Learn
Climate risk product patterns, geospatial + LLM guardrails, resilience comms
