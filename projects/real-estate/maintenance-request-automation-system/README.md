System Type: Workflow  
Complexity: Level 2  
Industry: Real Estate  
Capabilities: Automation  

# Maintenance Request Automation System

## 🧠 Overview
**Workflows** triage **tenant/property maintenance requests** from portal, SMS, or email: classify urgency, route to **vendor**, schedule **SLA timers**, and track **completion proofs**—optional LLM classifies **intent + urgency** from text with **confidence thresholds** sending unknowns to humans.

---

## 🎯 Problem
After-hours leaks and HVAC failures get lost; vendors miss SLAs without a single system of record.

---

## 💡 Why This Matters
Protects assets, tenant satisfaction, and warranty compliance across portfolios.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first).

---

## ⚙️ Complexity Level
**Target:** Level 2. Routing + notifications + vendor APIs; L3+ adds parts inventory and predictive maintenance hooks.

---

## 🏭 Industry
Property management / facilities

---

## 🧩 Capabilities
Automation, Classification, Monitoring, Observability

---

## 🛠️ Suggested TypeScript Stack
Temporal/Inngest, Node.js, Twilio/email, Yardi/Buildium/AppFolio APIs, ServiceTitan/work order APIs, Postgres, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Maintenance Request Automation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **real-estate** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- MLS / listing feeds (license-dependent)
- Maps APIs
- CRM (HubSpot, Salesforce) if broker workflow

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
Intake → classify → create WO → vendor assignment rules → SLA escalations → completion photo/invoice attach → tenant notify

---

## 🔄 Implementation Steps
Manual triage queue → rules by keywords → LLM assist with schema → vendor roster integration → mobile tenant portal status

---

## 📊 Evaluation
Time-to-dispatch, first-time fix rate, SLA breach rate, tenant CSAT, vendor invoice error rate

---

## ⚠️ Challenges & Failure Cases
Misclassified emergencies; duplicate tickets; vendor API outage; PII in public SMS threads; LLM suggesting unlicensed trades—escalation paths, dedupe keys, templates, license checks

---

## 🏭 Production Considerations
After-hours on-call rotations, licensed contractor verification, insurance certs, audit trail for liability, multilingual templates

---

## 🚀 Possible Extensions
IoT sensor triggers (leak detectors), warranty auto-lookup

---

## 🔁 Evolution Path
Email rules → durable workflows → LLM triage assist → predictive maintenance layer

---

## 🎓 What You Learn
Ops orchestration for physical assets, vendor integrations, SLA design
