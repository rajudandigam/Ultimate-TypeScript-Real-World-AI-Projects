System Type: Workflow  
Complexity: Level 2  
Industry: Security / Privacy  
Capabilities: Extraction, Privacy  

# PII Redaction Gateway

## 🧠 Overview
**Middleware** that sits between **clients and upstream LLM/embedding vendors**, applying **deterministic NER + regex + allowlisted transforms** to **redact or tokenize** PII/PCI-like fields **before** payloads leave trust zone, then **optional de-tokenization** on responses if using **reversible vault tokens** for known entities—designed for **audit logs**, **rate limits**, and **policy packs** per tenant.

---

## 🎯 Problem
Engineering teams paste production logs into copilots; support bots leak emails; DLP alone misses structured JSON fields.

---

## 💡 Why This Matters
- **Pain it removes:** Regulatory exposure and accidental training data leakage to third parties.
- **Who benefits:** Security architects enabling LLM adoption with defensible controls.

---

## 🏗️ System Type
**Chosen:** **Workflow** — parse → classify spans → transform → forward → log metadata (hashed), with **no** model creativity on redaction decisions.

---

## ⚙️ Complexity Level
**Target:** Level 2 — focused gateway with clear policy surface.

---

## 🏭 Industry
Enterprise security

---

## 🧩 Capabilities
Extraction, Privacy, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js proxy (Fastify/Express), Presidio or Microsoft Presidio patterns, WASM for hot paths, HashiCorp Vault for token vault, Redis, OpenTelemetry, JSONPath rules engine

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **PII Redaction Gateway** (Workflow, L2): prioritize components that match **workflow** orchestration and the **security-ai** integration surface.

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
Request hits gateway → **redaction workflow** builds transformed body → forwards to model API → optional response pass to strip leaked echoes → returns to client with **redaction manifest** id

---

## 🔄 Implementation Steps
1. JSONPath allowlist/blocklist MVP  
2. Streaming SSE chunk redaction (hard; start buffered)  
3. Per-tenant policy packs (finance vs HR)  
4. Detokenization for internal tools only  
5. SIEM alerts on high-redaction-rate anomalies (possible attack)  

---

## 📊 Evaluation
Recall/precision on labeled payloads, added latency p99, false redaction rate hurting UX, incident count of leaks post-deployment

---

## ⚠️ Challenges & Failure Cases
**Nested JSON** edge paths; multilingual names; **over-redaction** breaking valid JSON—schema-aware walkers, per-locale models, dry-run mode, golden tests per API route

---

## 🏭 Production Considerations
mTLS to LLM vendor, key rotation, no logging of raw payloads, BYOK options, SOC2 evidence exports

---

## 🚀 Possible Extensions
Learning from analyst overrides to suggest new JSONPath rules (human-approved merge)

---

## 🤖 Agent breakdown
No LLM agents on critical path—**policy compiler**, **span classifiers**, and **transformers** are services; optional **LLM policy assistant** drafts YAML off sample traffic in staging only.

---

## 🎓 What You Learn
Privacy engineering for LLM traffic, gateway patterns, compliance-friendly logging
