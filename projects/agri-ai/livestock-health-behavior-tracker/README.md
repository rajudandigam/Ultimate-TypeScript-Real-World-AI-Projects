System Type: Workflow  
Complexity: Level 4  
Industry: Agriculture / Livestock  
Capabilities: Monitoring, Prediction  

# Livestock Health & Behavior Tracker

## 🧠 Overview
Ingests **collar/pedometer/ear-tag telemetry**, **pasture GPS traces**, and **optional video snippets** to detect **illness and estrus proxies**, **lame gait trends**, and **anomalous grouping** (predator stress)—runs as **durable workflows** with **vet escalation** paths, **cold-chain data integrity**, and **herd-level dashboards** (not individual surveillance theater).

---

## 🎯 Problem
Large herds hide sick animals until mortality; manual checks do not scale; sensor noise causes alert fatigue.

---

## 💡 Why This Matters
- **Pain it removes:** Late treatment, antibiotic overuse from guessing, and lost productivity in dairy/beef operations.
- **Who benefits:** Producers, cooperative vets, and precision livestock startups.

---

## 🏗️ System Type
**Chosen:** **Workflow** — ingest → feature windows → model scores → case management; **Agent optional** for **vet-facing summaries** from structured timelines only.

---

## ⚙️ Complexity Level
**Target:** Level 4 — streaming scale, multimodal hints, and regulated advice boundaries.

---

## 🏭 Industry
Livestock / ranching

---

## 🧩 Capabilities
Monitoring, Prediction, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, MQTT/LORaWAN gateways, TimescaleDB, dbt features, Python sklearn/Torch workers, Mapbox pasture geofences, Postgres animal registry, OpenTelemetry, mobile vet app webhooks

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Livestock Health & Behavior Tracker** (Workflow, L4): prioritize components that match **workflow** orchestration and the **agri-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- MQTT / device telemetry brokers
- Time-series or historian APIs
- Weather or grid data feeds where relevant

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
Sensor uplink → **validation workflow** (range, duplicate device) → **feature jobs** (rumination minutes, distance traveled) → **risk scorer** → alert tiering → vet portal case → treatment outcome capture for retrain

---

## 🔄 Implementation Steps
1. Single-species rumination baseline  
2. Add GPS virtual fence breach alerts  
3. Heat detection proxy curves for dairy  
4. Multi-parcel aggregation for ranchers  
5. Integration with herd management software (e.g., compliant APIs)  

---

## 📊 Evaluation
Lead time to confirmed illness vs necropsy labels (where ethically available), alert precision, vet time saved, sensor battery failure modes tracked

---

## ⚠️ Failure Scenarios
Lost collar = false “missing”; **herd-wide stress spike** from weather not disease—contextual covariates, herd baselines, explicit “environmental stress” class; **wrong animal ID** mapping—RFID cross-checks at chute

---

## 🤖 / workflow breakdown
- **Ingest workflow:** dedupe, unit conversion, gap flags.  
- **Window aggregator:** rolling 24h/7d stats per animal.  
- **Detector suite:** classical thresholds + gradient boosting + optional video snippet classifier.  
- **Case workflow:** SLA timers, vet assignment, treatment log.  
- **Optional vet summary agent:** reads case JSON only; no treatment prescriptions without licensed workflow partner.

---

## 🎓 What You Learn
Animal telemetry at scale, regulated advice boundaries, field IoT reliability
