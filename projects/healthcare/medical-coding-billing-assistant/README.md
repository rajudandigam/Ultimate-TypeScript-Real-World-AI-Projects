System Type: Workflow  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Classification  

# Medical Coding & Billing Assistant

## 🧠 Overview
Workflow ingests **clinical documentation**, runs **NLP + rules** to propose **ICD/CPT/HCPCS** codes with **confidence**, validates against **payer edits** (where data available), and routes to **coder review**—**human coder** approves final codes; this is **not** autonomous billing submission without compliance sign-off.

---

## 🎯 Problem
Denials from under/over coding; coder shortage. Need **auditability** and **payer rule** integration.

---

## 🏗️ System Type
**Chosen:** Workflow (parse note → candidates → rules → review → export).

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Healthcare / RCM / coding vendors.

---

## 🧩 Capabilities
Classification, Validation, Automation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Temporal**, NLP models (hosted), **Postgres**, payer rulesets as data, **OpenTelemetry**.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Medical Coding & Billing Assistant** (Workflow, L3): prioritize components that match **workflow** orchestration and the **healthcare** integration surface.

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
EHR note export → de-id pipeline → coding engine → coder workbench → billing system export.

---

## 🔄 Implementation Steps
Rules baseline → ML/NLP candidates → LLM **reformat** only from candidate list → denial feedback loop.

---

## 📊 Evaluation
First-pass acceptance rate, denial rate delta, coder time per chart.

---

## ⚠️ Challenges & Failure Cases
**Upcoding** risk—policy caps on auto-apply. **Hallucinated** codes—schema allowlist. **PHI** leakage—strict pipelines.

---

## 🏭 Production Considerations
HIPAA, coder licensing oversight, payer change management, audit logs per chart version.

---

## 🚀 Possible Extensions
DRG grouping assist, charge capture reconciliation.

---

## 🔁 Evolution Path
Suggest → semi-auto with thresholds → continuous learning from denials (governed).

---

## 🎓 What You Learn
RCM pipeline, coding compliance, human-in-loop ML deployment.
