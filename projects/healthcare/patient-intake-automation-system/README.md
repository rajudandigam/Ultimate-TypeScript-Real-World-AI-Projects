System Type: Workflow  
Complexity: Level 2  
Industry: Healthcare  
Capabilities: Extraction, Automation  

# Patient Intake Automation System

## 🧠 Overview
**HIPAA-aware** intake workflows: capture forms/OCR, **validate** insurance and demographics, map to **EHR fields**, and route exceptions to staff—**not** a substitute for clinical judgment. Requires **BAAs**, **minimum necessary** PHI, and **human sign-off** where your compliance team mandates.

---

## 🎯 Problem
Manual intake causes errors, denials, and long wait times. Automation must be **auditable** and **reversible**.

---

## 🏗️ System Type
**Chosen:** Workflow (ingest → validate → write to EHR via FHIR/API → notify).

---

## ⚙️ Complexity Level
**Target:** Level 2–3 boundary; start L2 with rules + OCR.

---

## 🏭 Industry
Healthcare / ambulatory / hospital registration.

---

## 🧩 Capabilities
Extraction, Automation, Validation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Temporal**/**Inngest**, **Node.js**, **FHIR** client, **Postgres** (encrypted), OCR vendor, **OpenTelemetry**.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Patient Intake Automation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **healthcare** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

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
Kiosk/web form → workflow → validation services → EHR write adapter → audit.

---

## 🔄 Implementation Steps
PDF forms → structured fields → eligibility check stub → FHIR Patient/Coverage create → staff queue for failures.

---

## 📊 Evaluation
Field error rate, time-to-ready, denial rate delta, staff override rate.

---

## ⚠️ Challenges & Failure Cases
OCR misread MRNs—**double human confirm** for critical IDs. **Wrong patient** merge—strong dedupe keys. Vendor API down—queue + SLA alerts. **PHI** in logs—redaction.

---

## 🏭 Production Considerations
HIPAA, encryption, access logs, retention, break-glass, disaster recovery, state privacy laws.

---

## 🚀 Possible Extensions
Eligibility real-time, multilingual forms, e-sign.

---

## 🔁 Evolution Path
Rules → ML assist → full workflow with exception analytics.

---

## 🎓 What You Learn
FHIR basics, PHI-safe pipelines, front-desk operations engineering.
