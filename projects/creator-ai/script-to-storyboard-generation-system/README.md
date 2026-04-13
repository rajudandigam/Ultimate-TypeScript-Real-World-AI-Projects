System Type: Workflow  
Complexity: Level 4  
Industry: Film / Creator Production  
Capabilities: Multimodal, Planning  

# Script to Storyboard Generation System

## 🧠 Overview
Parses **screenplay Fountain/Final Draft exports**, segments **scenes and beats**, and produces **storyboard frame specs** (composition, lens, lighting notes, reference mood links) plus **optional image generations** from **approved style packs**—runs as **workflow DAG** with **director review** gates, **continuity tracking** (wardrobe, props), and **shot list exports** to **PDF/CSV** for ADs.

---

## 🎯 Problem
Previs is expensive; early creative alignment between writer, director, and DP is slow; ad-hoc Midjourney dumps lack continuity and legal hygiene.

---

## 💡 Why This Matters
- **Pain it removes:** Misinterpreted scenes before expensive location days.
- **Who benefits:** Indies, commercial production companies, and animation pipelines.

---

## 🏗️ System Type
**Chosen:** **Workflow** — parse → graph → shot plan → asset gen → QC; **Agent steps** optional inside **shot writer** nodes with strict schemas.

---

## ⚙️ Complexity Level
**Target:** Level 4 — long documents, multimodal outputs, rights/compliance.

---

## 🏭 Industry
Creative production

---

## 🧩 Capabilities
Multimodal, Planning, Generation, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Fountain/FDX parsers, Postgres scene graph, OpenAI Images API / SDXL self-host (policy), Three.js previz thumbnails, S3, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Script to Storyboard Generation System** (Workflow, L4): prioritize components that match **workflow** orchestration and the **creator-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SendGrid / SES / customer.io for outbound
- Meta / Google Ads APIs (only if ads are in-scope)
- YouTube / podcast hosting APIs when media ingestion applies

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
Script upload → **parse workflow** → **scene graph** → **shot planner workflow** (beats → coverage) → **board spec JSON** → **render farm** (GPU) → **QC** (continuity diff) → export packages

---

## 🔄 Implementation Steps
1. Scene headings + dialogue blocks only  
2. Character registry + wardrobe continuity tags  
3. Lens pack library (16/35/50) with director presets  
4. Location feasibility flags from producer metadata  
5. Rights-cleared reference moodboard ingestion only  

---

## 📊 Evaluation
Director edit distance on shot counts, continuity error catch rate, time-to-first-board package, rights incident count (target 0)

---

## ⚠️ Failure Scenarios
**Hallucinated props**; **unfilmable blocking** in tiny practical locations; model **style drift** across frames—human sign-off per scene, locked LoRA/style seeds, explicit “needs location scout” flags

---

## 🤖 / workflow breakdown
- **Parser workflow:** AST for screenplay elements.  
- **Planner workflow:** coverage rules (master, OS, inserts).  
- **Prompt compiler nodes:** build image gen prompts from structured shot JSON only.  
- **QC workflow:** face/prop count consistency checks vs registry; block export on violations.  
- **Optional dialogue agent:** suggests shot motivation blurbs from scene text with character name locks.

---

## 🎓 What You Learn
Creative pipeline DAGs, continuity as data, rights-aware generative media
