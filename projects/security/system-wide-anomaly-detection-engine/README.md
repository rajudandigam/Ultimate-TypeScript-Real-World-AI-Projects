System Type: Workflow  
Complexity: Level 3  
Industry: Security  
Capabilities: Detection  

# System-Wide Anomaly Detection Engine

## 🧠 Overview
A **metrics-, log-, and behavior-aware workflow** that builds **baseline models** per entity (user, host, service), scores **multivariate anomalies**, and routes **high-signal events** to **on-call** with **explainable features**—designed for **low false-positive** operations at cloud scale.

---

## 🎯 Problem
Traditional static thresholds miss slow burns; naive ML floods analysts. You need **consistent feature pipelines** and **controlled sensitivity** per asset class.

---

## 💡 Why This Matters
- **Pain it removes:** Blind spots between siloed tools and alert storms from naive z-scores.
- **Who benefits:** SOC, SRE, and security engineering teams defending hybrid estates.

---

## 🏗️ System Type
**Chosen:** **Workflow** — feature extraction, training windows, scoring, and suppression rules are **data pipelines**; optional **LLM** only formats **human summaries** from structured anomaly payloads.

---

## ⚙️ Complexity Level
**Target:** Level 3 — streaming joins, seasonal baselines, and org-specific policies.

---

## 🏭 Industry
Security / observability

---

## 🧩 Capabilities
Detection, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Kafka/Pulsar or cloud logging sinks, ClickHouse or BigQuery, Flink/Beam (or managed stream), Prometheus/Mimir, Grafana, OpenTelemetry, isolation forests / robust PCA in Python sidecars callable from TS orchestrator

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **System-Wide Anomaly Detection Engine** (Workflow, L3): prioritize components that match **workflow** orchestration and the **security** integration surface.

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
Telemetry ingest → feature store → baseline trainer (scheduled) → real-time scorer → dedupe/suppress → incident workflow → feedback loop labels

---

## 🔄 Implementation Steps
1. Single signal (failed logins) with thresholds  
2. Add seasonal baselines per cohort  
3. Multi-signal fusion rules  
4. Analyst feedback → semi-supervised reweight  
5. Cross-account anomaly export for MSSPs  

---

## 📊 Evaluation
Precision@k on labeled incidents, MTTD/MTTR deltas, noise ratio per team, infra cost per TB ingested

---

## ⚠️ Challenges & Failure Cases
Concept drift after releases; coordinated low-and-slow attacks; **legitimate bulk jobs** flagged—cohort segmentation, change calendars, allowlists with expiry, adversarial feedback poisoning

---

## 🏭 Production Considerations
PII minimization in raw logs, encryption keys rotation, tenant isolation, sampling under pressure with bias awareness

---

## 🚀 Possible Extensions
Graph edges (lateral movement) layered on top of statistical anomalies

---

## 🔁 Evolution Path
Thresholds → seasonal stats → streaming ML → workflow-governed fusion with human labels

---

## 🎓 What You Learn
Feature stores for security, streaming scoring, operating ML in SOCs responsibly
