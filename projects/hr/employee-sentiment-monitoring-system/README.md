System Type: Workflow  
Complexity: Level 2  
Industry: HR  
Capabilities: Monitoring  

# Employee Sentiment Monitoring System

## 🧠 Overview
**Workflows** ingest **anonymized or minimum-necessary** feedback (engagement surveys, optional public review sites where licensed, support tickets tagged HR-adjacent) and compute **themes + trends**; optional LLM summarizes **aggregated** buckets only—**no** individual surveillance framing; **attrition risk** outputs are **cohort-level** or **opt-in manager dashboards** per policy and **works council** constraints.

---

## 🎯 Problem
Leadership sees annual survey PDFs too late; emerging morale issues hide in noise until attrition spikes.

---

## 💡 Why This Matters
- **Pain it removes:** Slow response to systemic issues and weak follow-through on action plans.
- **Who benefits:** People analytics and ER teams in enterprises with mature privacy governance.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). ETL → theme detection → alerting; LLM optional on aggregates.

---

## ⚙️ Complexity Level
**Target:** Level 2. Scheduled jobs + dashboards + thresholds; L3+ adds hierarchical models with stronger fairness review.

---

## 🏭 Industry
HR / people analytics

---

## 🧩 Capabilities
Monitoring, Prediction (cohort risk scores), Automation (alerts), Observability

---

## 🛠️ Suggested TypeScript Stack
Inngest/Temporal, Node.js, survey APIs (Qualtrics/Culture Amp), warehouse (Snowflake), optional LLM for theme labels, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Employee Sentiment Monitoring System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **hr** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Workday / BambooHR / Greenhouse-style APIs (pick what your org uses)
- Slack / Teams
- Google Drive / SharePoint for doc sources

### Open Source Building Blocks
- **n8n** — fast integration fabric when the blueprint is connector-heavy and ops wants visibility.
- **Temporal + TypeScript SDK** — when you need durable timers, saga compensation, and strict replay semantics.
- **BullMQ + Redis** — lighter option for queue-backed steps without full Temporal yet.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node worker + Postgres + Redis + Temporal (or n8n if integrations dominate) — auditable steps and retries match workflow-first designs.
- **Lightweight:** Hono + BullMQ + Postgres — ship a weekend MVP with cron + queue, migrate to Temporal when sleeps and compensations hurt.
- **Production-heavy:** Temporal Cloud + OTel + separate ingest workers + multi-region Postgres (read replicas) when SLAs and replay volume demand it.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Ingest → PII classification → aggregate store → topic/trend pipeline → dashboard + alert webhooks → action tracking workflow

---

## 🔄 Implementation Steps
Quarterly CSV import → automated survey API → theme model (classical or LLM-on-aggregates) → manager digests with thresholds → closed-loop action items

---

## 📊 Evaluation
Theme precision vs human coding sample, lead time on issues surfaced, false alert rate, employee trust (survey), legal review pass rate

---

## ⚠️ Challenges & Failure Cases
Re-identification from small teams; illegal monitoring perception; biased topic models; leaking verbatim comments in Slack alerts; vendor API outages—use k-anonymity rules, aggregate floors, redaction, human review queues, staleness banners

---

## 🏭 Production Considerations
Works council/EU consultation, retention schedules, DSAR, encryption, role-based access to verbatim vs themes only, ethics board sign-off for new sources

---

## 🚀 Possible Extensions
Pulse surveys integration, DEI-specific lenses with oversight

---

## 🔁 Evolution Path
Manual dashboards → automated ETL → LLM-labeled themes on aggregates → optional predictive HR copilots (high governance)

---

## 🎓 What You Learn
People analytics privacy engineering, workflow SLAs for HR signals, trustworthy aggregation
