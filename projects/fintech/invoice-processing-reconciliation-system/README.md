System Type: Workflow  
Complexity: Level 2  
Industry: Fintech  
Capabilities: Extraction, Matching  

# Invoice Processing & Reconciliation System

## 🧠 Overview
A **workflow** that **extracts** invoice line items (OCR + templates), **matches** to purchase orders and receipts using **deterministic keys** (PO number, amount tolerance, vendor id), and **flags discrepancies** for AP review—distinct from the **Finance** “Invoice Processing Pipeline” by emphasizing **three-way match** and **exception queues**.

---

## 🎯 Problem
AP teams chase mismatched totals, duplicate payments, and missing PO links. Automation must be **explainable** and **idempotent**.

---

## 🏗️ System Type
**Chosen:** Workflow (ETL + match + exception routing).

---

## ⚙️ Complexity Level
**Target:** Level 2. Extraction + matching rules; grow toward L3–L4 with ML matching.

---

## 🏭 Industry
Fintech / B2B payments / AP automation.

---

## 🧩 Capabilities
Extraction, Matching, Automation, Validation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Inngest**/**Temporal**, **Node.js**, **S3**, **Postgres**, OCR vendor or **Textract**.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Invoice Processing & Reconciliation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **fintech** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
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
Upload → OCR → normalize → match engine → post to ERP or queue exceptions.

---

## 🔄 Implementation Steps
Template invoices → OCR → PO master join → tolerance rules → human exception UI.

---

## 📊 Evaluation
Match rate, $ disputed recovered, time-to-close, false match rate (critical KPI).

---

## ⚠️ Challenges & Failure Cases
OCR garbage; **wrong PO link**—mitigate confidence thresholds + human confirm. Duplicate payments—idempotency keys. Vendor format drift—template versioning.

---

## 🏭 Production Considerations
Audit trail, segregation of duties, encryption, ERP API rate limits, SOX-style controls if applicable.

---

## 🚀 Possible Extensions
ML line pairing, global vendor network dedupe, early pay discount optimizer.

---

## 🔁 Evolution Path
Rules → ML assist → workflow orchestration → optional agent for exception narratives.

---

## 🎓 What You Learn
Three-way match, idempotent payments, AP exception workflows.
