System Type: Workflow  
Complexity: Level 2  
Industry: Healthcare  
Capabilities: Validation  

# Drug Interaction Checker

## 🧠 Overview
Workflow that normalizes **RxNorm/med mapping**, queries **authoritative drug interaction databases** (vendor or local curated tables), and returns **severity-coded** results with **clinical disclaimers**—**not** autonomous prescribing changes; **pharmacist/doctor** remains decision-maker. LLM optional only for **patient education** text templated from structured severities.

---

## 🎯 Problem
Polypharmacy risk; EHR alerts fatigue. Need **deterministic** checks plus clear UX.

---

## 🏗️ System Type
**Chosen:** Workflow (parse → normalize → DB lookup → route alerts).

---

## ⚙️ Complexity Level
**Target:** Level 2–3.

---

## 🏭 Industry
Healthcare / pharmacy / EHR adjunct.

---

## 🧩 Capabilities
Validation, Automation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Postgres** (interaction tables + versions), **RxNorm** APIs, workflow engine.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Drug Interaction Checker** (Workflow, L2): prioritize components that match **workflow** orchestration and the **healthcare** integration surface.

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
Medication list in → normalize codes → interaction matrix query → alert to clinician UI.

---

## 🔄 Implementation Steps
Static tables → RxNorm mapping → severity tiers → EHR hook or standalone API.

---

## 📊 Evaluation
False positive/negative rates vs pharmacist gold set (pilot), alert override reasons.

---

## ⚠️ Challenges & Failure Cases
**Wrong mapping** generic→brand—mitigate human review queue. **Stale DB**—version pins. **LLM adds** contraindications not in DB—**forbid**; templates only.

---

## 🏭 Production Considerations
FDA/regional rules for CDS, audit, PHI minimization, update cadence for drug data vendor.

---

## 🚀 Possible Extensions
Genetic variant overlays (PGx) as separate licensed module.

---

## 🔁 Evolution Path
Lookup-only → workflow routing → optional education LLM with zero clinical claims beyond DB.

---

## 🎓 What You Learn
Medication normalization, safety-critical UX, CDS governance.
