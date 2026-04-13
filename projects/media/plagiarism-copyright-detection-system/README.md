System Type: Workflow  
Complexity: Level 2  
Industry: Media  
Capabilities: Detection  

# Plagiarism & Copyright Detection System

## 🧠 Overview
**Workflows** fingerprint **incoming articles, scripts, and uploads**, run **shingle/hash similarity** against **internal corpus + licensed reference DBs**, and optionally **web matches** via **approved APIs**—flags **review queues** with **evidence diffs**; **DMCA** process hooks and **false positive** triage are first-class.

---

## 🎯 Problem
UGC platforms and publishers risk infringement and duplicate SEO penalties.

---

## 💡 Why This Matters
Protects revenue, search rankings, and legal exposure while keeping creators moving.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). LLM optional only to **paraphrase** flagged snippets into neutral reviewer notes—not the detector core.

---

## ⚙️ Complexity Level
**Target:** Level 2.

---

## 🏭 Industry
Publishing / UGC platforms

---

## 🧩 Capabilities
Detection, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, MinHash/SimHash pipelines, Elasticsearch/OpenSearch, Turnitin/Crossref APIs if licensed, Postgres case mgmt, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Plagiarism & Copyright Detection System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **media** integration surface.

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
Upload → normalize text → fingerprint → match index → score threshold → ticket → human/legal workflow → outcome logged

---

## 🔄 Implementation Steps
Internal duplicate detection → add licensed reference corpus → add external API matches → SLA dashboards → appeals workflow

---

## 📊 Evaluation
Precision/recall on labeled set, time-to-triage, false positive rate, legal escalations per million docs

---

## ⚠️ Challenges & Failure Cases
Common phrases flagged; translated plagiarism missed; API false positives; storing infringing copies too long—tuning thresholds, multilingual embeddings, retention policy, human appeal

---

## 🏭 Production Considerations
Jurisdiction for fair use, privacy of unpublished manuscripts, secure review rooms, audit exports for counsel

---

## 🚀 Possible Extensions
Image near-duplicate detection (perceptual hash) as separate pipeline

---

## 🔁 Evolution Path
Hashes → embeddings → hybrid retrieval → human-in-loop legal outcomes feeding active learning

---

## 🎓 What You Learn
Content integrity engineering, legal-adjacent workflows, similarity at scale
