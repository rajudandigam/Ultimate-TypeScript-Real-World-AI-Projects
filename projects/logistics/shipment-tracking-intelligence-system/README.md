System Type: Workflow  
Complexity: Level 2  
Industry: Logistics  
Capabilities: Monitoring  

# Shipment Tracking Intelligence System

## 🧠 Overview
**Workflows** normalize **carrier events** (EDI 214, API webhooks, scraping only where permitted), detect **delay risk** vs promised delivery, and notify **customers/CS** with **root-cause hints** from **milestone graphs**—optional LLM drafts **status messages** from structured delay codes only.

---

## 🎯 Problem
WISMO tickets explode when milestones stall; ops teams lack unified exception queues across carriers.

---

## 💡 Why This Matters
Proactive comms reduce churn and call center load in e-commerce and B2B shipping.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first).

---

## ⚙️ Complexity Level
**Target:** Level 2.

---

## 🏭 Industry
Parcel / freight visibility

---

## 🧩 Capabilities
Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Inngest/Temporal, Node.js, carrier APIs (FedEx/UPS/DHL), project44 / FourKites optional, Postgres event store, Twilio/email, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Shipment Tracking Intelligence System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **logistics** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
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
Track ingest → state machine per shipment → SLA rules → alert + customer message templates → CRM/ticket sync

---

## 🔄 Implementation Steps
Single carrier MVP → multi-carrier normalize → predictive ETA ML optional → proactive comms A/B

---

## 📊 Evaluation
Prediction accuracy for late arrivals, ticket deflection %, customer satisfaction, false alert rate

---

## ⚠️ Challenges & Failure Cases
Bad milestone mapping; duplicate events; timezone bugs; LLM promising impossible delivery dates—use carrier ETAs only, idempotent event keys, human templates

---

## 🏭 Production Considerations
PII in tracking pages, rate limits, carrier ToS, multilingual templates, audit for refunds triggered by delays

---

## 🚀 Possible Extensions
Exception root-cause clustering, dock appointment scheduling hooks

---

## 🔁 Evolution Path
Polling → event-driven → predictive alerts → automated goodwill policies (finance-gated)

---

## 🎓 What You Learn
Carrier integration patterns, state machines for logistics, customer comms at scale
