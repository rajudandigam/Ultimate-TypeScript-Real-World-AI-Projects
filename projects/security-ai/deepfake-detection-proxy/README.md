System Type: Workflow  
Complexity: Level 4  
Industry: Security / Media Integrity  
Capabilities: Analysis, Monitoring  

# Deepfake Detection Proxy

## 🧠 Overview
Sits as a **workflow-backed inspection proxy** in front of **live or VOD video pipelines** (events, KYC liveness, news ingest), running **ensemble detectors** (temporal consistency, face mesh jitter, GAN artifact probes) and **policy actions** (flag, block, require step-up human review)—**not** a single-model toy; emphasizes **latency budgets**, **appeals**, and **model versioning**.

---

## 🎯 Problem
Synthetic media is increasingly convincing; downstream systems assume pixels are trustworthy.

---

## 💡 Why This Matters
- **Pain it removes:** Fraud, misinformation, and compliance exposure in high-trust video paths.
- **Who benefits:** Trust & safety teams, fintech video KYC, and broadcast ingest ops.

---

## 🏗️ System Type
**Chosen:** **Workflow** — frame sampling, fan-out to detectors, score fusion, and routing are deterministic graphs; LLM optional for **reviewer summary** only.

---

## ⚙️ Complexity Level
**Target:** Level 4 — realtime-ish paths, GPU ops, and adversarial robustness work.

---

## 🏭 Industry
Security / platform integrity

---

## 🧩 Capabilities
Analysis, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, FFmpeg segmenters, GPU workers (Python/TorchServe), Kafka, Redis feature cache, Postgres case store, OpenTelemetry, WebRTC SFU hooks (vendor-specific)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Deepfake Detection Proxy** (Workflow, L4): prioritize components that match **workflow** orchestration and the **security-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SIEM ingestion (Splunk HEC, Elastic, Datadog Logs)
- IdP / SCIM (Okta, Entra) for RBAC
- Cloud audit / CSP APIs for posture

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
Video ingress → keyframe sampler → parallel detectors → **fusion workflow** → decision (allow/flag/block) → SIEM + human review UI → feedback labels to retrain registry

---

## 🔄 Implementation Steps
1. VOD batch scanning MVP  
2. Near-live 2–5s delayed path for events  
3. Liveness-specific models for KYC  
4. Appeal workflow with forensic export  
5. Canary models with shadow scoring  

---

## 📊 Evaluation
AUC vs labeled deepfake corpus, false block rate on compression-heavy legit video, p99 added latency, reviewer agreement with machine score

---

## ⚠️ Challenges & Failure Cases
**Compression mimics GAN artifacts**; **dark skin bias** in some detectors; adaptive adversaries—calibration per codec/bitrate, fairness audits, ensemble disagreement triggers human review

---

## 🏭 Production Considerations
Regional data residency, child safety paths, legal hold on evidence clips, secure deletion schedules, red-team cadence

---

## 🚀 Possible Extensions
Signed media provenance (C2PA) verification branch before detectors

---

## 🤖 Agent breakdown
Workflow roles (not conversational agents): **sampler** → **detector workers** → **fusion** → **policy router**; optional **LLM summarizer** for analyst console only.

---

## 🎓 What You Learn
Streaming ML ops, fairness in detection, integrity UX under latency pressure
