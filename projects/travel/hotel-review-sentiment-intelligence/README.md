System Type: Workflow  
Complexity: Level 2  
Industry: Travel  
Capabilities: Sentiment Analysis  

# Hotel Review Sentiment Intelligence

## 🧠 Overview
A **batch-first workflow** that **aggregates** hotel reviews from approved sources, runs **structured extraction** (topics, sentiment scores, trend deltas) via models or classifiers, and surfaces **dashboards** for revenue and operations teams—**without** treating generative prose as the source of truth for KPIs.

---

## 🎯 Problem
Star averages hide recurring issues (noise, cleanliness, front desk). Manual reading does not scale across properties. You need **repeatable pipelines**, **data licensing compliance**, and **evaluation** of sentiment quality over time.

---

## 💡 Why This Matters
- **Pain it removes:** Slow competitive benchmarking, blind spots before reputation crises, and weak prioritization of capex.
- **Who benefits:** Hotel chains, OTAs displaying “themes,” and asset managers monitoring portfolios.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

This is classic **ETL + NLP scoring** on a schedule: ingest → clean → chunk → score → aggregate. An LLM may assist **labeling** or **theme discovery** in controlled steps, but the spine is durable workflows.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Focus on **reliable ingestion**, **classification/sentiment**, and **aggregations**—not yet full enterprise data mesh or real-time streaming at global scale.

---

## 🏭 Industry
Example:
- Travel (hospitality analytics, reputation management, OTA merchandising)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (internal SOP docs for “what to do about spike in noise”)
- Planning — light (pipeline DAG)
- Reasoning — optional (LLM summarizes spikes from charts + quotes)
- Automation — **in scope** (scheduled jobs, alerts)
- Decision making — bounded (threshold alerts, not auto-replies to guests)
- Observability — **in scope**
- Personalization — optional (per brand lexicon)
- Multimodal — optional (photo reviews via separate moderation pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Inngest** / **Temporal** / **cron** workers
- **Postgres** + **TimescaleDB** (trends)
- **OpenAI SDK** or **small open models** for classification
- **S3-compatible** object storage for raw snapshots (license-dependent)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Hotel Review Sentiment Intelligence** (Workflow, L2): prioritize components that match **workflow** orchestration and the **travel** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Duffel / Amadeus / airline NDC (availability-dependent)
- Google Places & Routes or Mapbox (routing, POI hours)
- Weather APIs for outdoor risk

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
Describe the main components:

- **Input (UI / API / CLI):** Connector configs, property list, alert thresholds.
- **LLM layer:** Optional summarization step over **aggregated stats** and short quote samples.
- **Tools / APIs:** Partner review APIs, scraping only where ToS allow (prefer official feeds).
- **Memory (if any):** Taxonomy versions (themes), retrain metadata.
- **Output:** BI tables, email/Slack alerts, API for OTA badges.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Ingest CSV exports; compute star distribution only.

### Step 2: Add AI layer
- LLM assigns single topic labels to each review with JSON schema; validate against allowed taxonomy.

### Step 3: Add tools
- Add translation step for non-English reviews (deterministic service) before scoring.

### Step 4: Add memory or context
- Versioned theme taxonomy with migration workflow when labels change.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional “analyst agent” for quarterly reports—still fed by SQL aggregates first.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Inter-annotator agreement on sample labels; drift after taxonomy changes.
- **Latency:** Pipeline runtime per property per day.
- **Cost:** $ per million reviews scored (model + storage).
- **User satisfaction:** Ops team finds alerts actionable; fewer surprise TripAdvisor crises.
- **Failure rate:** Duplicate reviews, wrong property mapping, biased sentiment on short texts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented review quotes; mitigated by storing only **verbatim spans** with offsets from source text.
- **Tool failures:** API rate limits; mitigated by backoff, partial runs, and replay from checkpoints.
- **Latency issues:** Huge backlog after outage; mitigated by idempotent chunk processing and autoscale workers.
- **Cost spikes:** Re-LLM entire history nightly; mitigated by hashing unchanged reviews and skipping.
- **Incorrect decisions:** Misclassifying sarcasm; mitigated by human review queues, confidence thresholds, and per-language models.

---

## 🏭 Production Considerations

- **Logging and tracing:** Pipeline step metrics; never log disallowed PII beyond what sources already expose publicly (still minimize).
- **Observability:** Data freshness lag, null rate by field, sentiment drift monitors, duplicate detection rate.
- **Rate limiting:** Respect partner API quotas; per-tenant concurrency caps.
- **Retry strategies:** Chunk-level retries; DLQ for poison records with manual quarantine.
- **Guardrails and validation:** Content moderation on stored text; legal review for scraping; GDPR for EU properties if storing personal data from reviews.
- **Security considerations:** Tenant isolation, encryption at rest, access audit for competitive data.

---

## 🚀 Possible Extensions

- **Add UI:** Property comparison and anomaly detection charts.
- **Convert to SaaS:** Multi-brand portfolio rollups.
- **Add multi-agent collaboration:** Separate moderation agent for images (optional).
- **Add real-time capabilities:** Near-real-time ingest for partners with streaming APIs.
- **Integrate with external systems:** CRM for GM tasks, Slack alerts, revenue management systems.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start **batch and auditable**; add conversational exploration only after metrics stabilize.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **NLP pipelines** as workflows, not chats
  - **Taxonomy versioning** and evaluation
  - **Reputation data** licensing and ethics
  - **System design thinking** for analytics products
