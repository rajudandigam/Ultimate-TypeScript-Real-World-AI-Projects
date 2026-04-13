System Type: Agent  
Complexity: Level 3  
Industry: Sustainability / Climate  
Capabilities: Analytics  

# Climate & Sustainability Intelligence Agent

## 🧠 Overview
An **analytics agent** that **ingests utility bills, travel logs, procurement data, and cloud usage**, estimates **carbon equivalents** with **transparent factors**, and proposes **abatement projects** with **ROI and uncertainty bands**—outputs are **audit-friendly** and never masquerade as regulatory filings.

---

## 🎯 Problem
Sustainability data lives in spreadsheets; emission factors go stale; executives need credible narratives tied to operations.

---

## 💡 Why This Matters
- **Pain it removes:** Greenwashing risk from hand-wavy dashboards and opaque conversions.
- **Who benefits:** Sustainability leads, finance, and ops teams targeting net-zero roadmaps.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **SQL + document tools**; calculations run in **deterministic engines** the agent orchestrates.

---

## ⚙️ Complexity Level
**Target:** Level 3 — heterogeneous data, factor libraries, and sensitivity analysis.

---

## 🏭 Industry
Climate / ESG operations

---

## 🧩 Capabilities
Analytics, Planning, Reasoning, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Node.js, BigQuery/Snowflake, dbt for transforms, EPA/IPCC factor tables (versioned), OpenAI SDK for narrative on numbers only, Postgres lineage store, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Climate & Sustainability Intelligence Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **sustainability** integration surface.

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
Connectors → **carbon ledger** tables → **Sustainability Agent** (query + explain) → initiative tracker → export for CSRD-adjacent reporting (human finalized)

---

## 🔄 Implementation Steps
1. Cloud carbon from billing APIs  
2. Office energy from utility CSVs  
3. Business travel from TMC feeds  
4. Scenario simulator (price on carbon)  
5. Third-party assurance package hooks  

---

## 📊 Evaluation
Reconciliation error vs manual audit, factor freshness SLA, forecast error on year-over-year totals, stakeholder trust surveys

---

## ⚠️ Challenges & Failure Cases
**Wrong emission factors** for region/grid mix; double counting; **LLM invents** savings numbers—lock math in SQL/dbt, agent cites row IDs only, human sign-off on disclosures

---

## 🏭 Production Considerations
Data residency, contractual use of third-party factors, uncertainty documentation, access control to sensitive travel data

---

## 🚀 Possible Extensions
Supplier engagement workflows (questionnaires + evidence requests)

---

## 🔁 Evolution Path
Spreadsheets → automated ledger → agent Q&A → continuous improvement with assurance loops

---

## 🎓 What You Learn
Carbon accounting basics, trustworthy AI over quantitative systems, data lineage
