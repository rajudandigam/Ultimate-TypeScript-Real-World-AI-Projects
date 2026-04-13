System Type: Workflow  
Complexity: Level 3  
Industry: Industrial / EHS  
Capabilities: Multimodal, Monitoring  

# Safety Protocol Compliance Monitor

## 🧠 Overview
A **workflow-first vision pipeline** for **fixed plant cameras** (and **optional wearable POV** where permitted) that detects **PPE gaps** (hard hat, hi-vis vest, safety glasses) and **zone violations** (person in energized area), raises **real-time alerts** with **evidence clips**, and feeds **EHS ticketing**—built for **false-positive control**, **union/site agreements**, and **no biometric identification** by default (event-level only).

---

## 🎯 Problem
Manual safety walks miss moments; after incidents, teams lack timestamped proof of training vs behavior; generic CV vendors ignore site-specific vest colors and restricted zones.

---

## 💡 Why This Matters
- **Pain it removes:** Preventable injuries, OSHA-style audit exposure, and inconsistent enforcement.
- **Who benefits:** EHS managers, site supervisors, and insurers reviewing loss prevention.

---

## 🏗️ System Type
**Chosen:** **Workflow** — decode → detect → track → rule engine → alert → retention; **LLM optional** only for **supervisor summary** of a shift dashboard, not per-frame.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multi-camera fusion, policies, and integration load.

---

## 🏭 Industry
Manufacturing / construction / logistics yards

---

## 🧩 Capabilities
Multimodal, Monitoring, Automation, Observability, Decision making

---

## 🛠️ Suggested TypeScript Stack
Node.js, FFmpeg/GStreamer ingest, GPU workers (YOLO-class + pose), Kafka, Redis dedupe windows, Postgres incidents, Temporal, Grafana, OpenTelemetry, Genetec/Milestone VMS hooks (examples)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Safety Protocol Compliance Monitor** (Workflow, L3): prioritize components that match **workflow** orchestration and the **industrial-ai** integration surface.

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
RTSP/WebRTC taps → **decode workers** → **detector workflow** (PPE + zone polygons) → **tracker** → **policy DAG** (cooldown, dual-camera confirm) → PagerDuty/Teams → CMMS/EHS export

---

## 🔄 Implementation Steps
1. Single camera + hard hat only, shadow mode  
2. Site-specific color models + vest classes  
3. Time-based hot work permits override rules  
4. Supervisor review queue with keyboard shortcuts  
5. Monthly calibration drift reports  

---

## 📊 Evaluation
Precision/recall on labeled shift footage, alert noise per 1000 worker-hours, time-to-acknowledge, repeat offender trend (aggregate, not individual surveillance creep)

---

## ⚠️ Failure Scenarios
Glare/occlusion false negatives; **similar-colored civilian clothes** false positives; camera blind spots after layout change—IR fill light policy, multi-camera corroboration, weekly polygon QA, explicit “unknown” state

---

## 🤖 / workflow breakdown
- **Ingest step:** shard by camera, normalize timestamps (PTP).  
- **Detect step:** ensemble models + site fine-tunes; outputs bounding tracks.  
- **Policy step:** deterministic rules (zone graph, permit TTL, cooldown).  
- **Notify step:** dedupe, severity, attach HLS clip + deep link.  
- **Optional LLM digest:** shift-level narrative from aggregated incident JSON only.

---

## 🎓 What You Learn
Safety-critical CV ops, privacy-preserving monitoring, workflow reliability at the edge
