System Type: Workflow  
Complexity: Level 3  
Industry: Security / Compliance  
Capabilities: Compliance  

# Compliance Audit Automation Platform

## 🧠 Overview
**Workflow-driven evidence collection** for frameworks like **SOC 2, ISO 27001, and HIPAA**, mapping **controls → checks** across cloud accounts, HR systems, and ticketing—produces **auditor-ready packets** with **versioned artifacts** and **exceptions workflows**.

---

## 🎯 Problem
Audit season is manual screenshot archaeology. Drift between “what we say” and “what runs” creates findings and fire drills.

---

## 💡 Why This Matters
- **Pain it removes:** Scattered evidence, missing owners, and last-minute panic.
- **Who benefits:** GRC teams, security engineers, and startups selling to enterprise buyers.

---

## 🏗️ System Type
**Chosen:** **Workflow** — checks must be **repeatable**, **timestamped**, and **deterministic**; LLMs assist only in **mapping narratives** to controls with human sign-off.

---

## ⚙️ Complexity Level
**Target:** Level 3 — many integrations, policy mapping, and exception handling.

---

## 🏭 Industry
Security / GRC

---

## 🧩 Capabilities
Compliance, Automation, Monitoring, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, cloud SDKs (AWS/Azure/GCP), Okta/Entra connectors, Jira/ServiceNow, Postgres, object storage, OpenTelemetry, PDF generation (e.g., pdf-lib)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Compliance Audit Automation Platform** (Workflow, L3): prioritize components that match **workflow** orchestration and the **security** integration surface.

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
Control framework library → scheduled collectors → evidence vault → gap engine → remediation tickets → export packager

---

## 🔄 Implementation Steps
1. Single-cloud CIS subset  
2. Cross-account org view  
3. Control mapping editor with tests  
4. Exception approvals with expiry  
5. Continuous control monitoring (CCM) dashboards  

---

## 📊 Evaluation
% controls green over time, evidence freshness SLA, audit finding reduction, hours saved per audit cycle

---

## ⚠️ Challenges & Failure Cases
**Stale read-only snapshots** mistaken as live; over-broad IAM for collectors; PII in evidence exports—scoped roles, data minimization, encryption at rest, signed manifests

---

## 🏭 Production Considerations
Segregation of duties, immutable audit logs, regional data residency, vendor risk register integration

---

## 🚀 Possible Extensions
Vendor questionnaire auto-fill from prior evidence with diff view

---

## 🔁 Evolution Path
Spreadsheets → scheduled checks → mapped frameworks → continuous compliance posture product

---

## 🎓 What You Learn
Control frameworks as code, evidence engineering, workflow reliability for GRC
