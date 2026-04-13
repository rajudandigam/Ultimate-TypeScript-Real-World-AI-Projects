System Type: Workflow  
Complexity: Level 2  
Industry: R&D / ELN  
Capabilities: Extraction, Structuring  

# Lab Notebook Auto-Summarization Pipeline

## 🧠 Overview
Turns **scanned notebook pages, tablet ink exports, and ELN free-text** into **structured experiment records** (objective, materials lot IDs, procedure steps, observations, results tables) stored in a **searchable database** with **provenance links** to source pages—**human-in-the-loop** verification for **IP-critical** and **GLP** environments.

---

## 🎯 Problem
Paper notebooks are not queryable; ELN copy-paste is inconsistent; audits require painful reconstruction of “what actually happened on bench 3 Tuesday.”

---

## 💡 Why This Matters
- **Pain it removes:** Lost institutional knowledge and slow audit prep.
- **Who benefits:** Bench scientists, lab managers, and QA in regulated labs.

---

## 🏗️ System Type
**Chosen:** **Workflow** — OCR → layout → table extract → schema map → review queue → commit; **LLM** only inside **bounded extraction** steps with **json schema validation**.

---

## ⚙️ Complexity Level
**Target:** Level 2 — focused ETL with review gates.

---

## 🏭 Industry
Life sciences / industrial R&D

---

## 🧩 Capabilities
Extraction, Structuring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Tesseract/Document AI, Camelot/tabula for tables, Postgres JSONB + full-text, OpenAI structured outputs, S3 WORM buckets optional, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Lab Notebook Auto-Summarization Pipeline** (Workflow, L2): prioritize components that match **workflow** orchestration and the **research-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
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
Upload batch → **preprocess workflow** (deskew, denoise) → **OCR workflow** → **structure workflow** (sections, tables) → **mapper** to internal ELN schema → reviewer UI → **ELN API commit** or **export CSV**

---

## 🔄 Implementation Steps
1. Typed templates per experiment class  
2. Lot number regex + dictionary validation  
3. Unit normalization (mg vs g) with flags  
4. PI approval on low-confidence pages only  
5. Diffable versioning per experiment ID  

---

## 📊 Evaluation
Character error rate on OCR sample, field-level F1 on structured fields, reviewer time saved, audit finding reduction

---

## ⚠️ Failure Scenarios
**Smudged stoichiometry** misread; **wrong lot linked**; PII in margin notes—confidence gating, mandatory human confirm for lot links, redaction pass for HR doodles

---

## 🤖 / workflow breakdown
- **OCR & layout workflow:** page segmentation, handwriting vs print routing.  
- **Extraction workflow:** table detection + LLM-assisted cell alignment (validated).  
- **Schema mapping workflow:** maps to ELN entities with foreign key checks.  
- **Review workflow:** diff view against source image; electronic signatures where required.

---

## 🎓 What You Learn
Document AI pipelines, regulated data capture, human verification UX
