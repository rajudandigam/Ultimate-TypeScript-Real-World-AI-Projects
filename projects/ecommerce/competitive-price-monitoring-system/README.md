System Type: Workflow  
Complexity: Level 2  
Industry: E-commerce  
Capabilities: Monitoring, Automation  

# Competitive Price Monitoring System

## 🧠 Overview
A **workflow-first monitor** that schedules **polite, policy-compliant** fetches of competitor and marketplace listings, normalizes **SKU mapping**, detects **price/availability deltas**, and routes **alerts** to merchandising tools—**no** LLM scraping chain as the backbone; optional LLM only for **change summaries** from structured diffs.

---

## 🎯 Problem
Pricing teams lose revenue to silent competitor moves and MAP violations; ad-hoc scripts break on HTML changes and create **legal/reputational** risk.

---

## 💡 Why This Matters
- **Pain it removes:** Stale spreadsheets, alert fatigue from noisy scrapers, and slow reaction loops.
- **Who benefits:** E-commerce merchandising, marketplace sellers, and pricing ops in regulated categories.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Reliability comes from **durable jobs**, **extractor versioning**, and **dead-letter queues**—not from an autonomous browsing agent.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Scheduler + parsers + alerting; L3+ adds semantic SKU matching and richer anomaly models.

---

## 🏭 Industry
Example:
- E-commerce / retail pricing operations

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional internal policy docs for legal thresholds
- Planning — bounded (crawl cadence planning)
- Reasoning — optional (summarize multi-SKU changes)
- Automation — **in scope** (jobs, alerts)
- Decision making — bounded (threshold rules)
- Observability — **in scope**
- Personalization — per-merchant alert prefs
- Multimodal — optional screenshot diff for promo banners

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Temporal** or **Inngest** for schedules and retries
- **Playwright** (where permitted) or **feed/API** integrations preferred
- **Node.js + TypeScript** workers
- **Postgres** for time-series price points
- **OpenTelemetry**, **PagerDuty**/Slack webhooks

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Competitive Price Monitoring System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **ecommerce** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Shopify / commerce platform Admin API
- Stripe
- Review / feed APIs for social proof

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

- **Input (UI / API / CLI):** SKU watchlists, competitor URL registry, robots.txt cache.
- **LLM layer:** Optional digest generator from JSON diffs only.
- **Tools / APIs:** Merchant PIM for internal MAP, notification channels.
- **Memory (if any):** Historical price series; extractor metadata versions.
- **Output:** Alerts, dashboards, CSV exports to pricing engines.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual URL list + cron fetch + XPath/CSS extractors.

### Step 2: Add AI layer
- LLM summarizes weekly delta tables for humans (no scraping via LLM).

### Step 3: Add tools
- Integrate official APIs/feeds where available; prefer over HTML.

### Step 4: Add memory or context
- Store competitor page structure fingerprints to detect layout shifts.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent proposes **new extractor** patches for human review in CI.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall on price change detection vs human labels.
- **Latency:** Freshness SLO (e.g., 95% of SKUs within N hours).
- **Cost:** Infra + optional LLM digest cost per SKU-month.
- **User satisfaction:** Merch NPS on alert usefulness.
- **Failure rate:** Blocked IPs, false alerts from promo noise, wrong SKU matches.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Only when LLM is misused for extraction; keep extraction deterministic.
- **Tool failures:** Sites change DOM; mitigated extractor versioning + canaries.
- **Latency issues:** Anti-bot delays; mitigated backoff and respectful concurrency.
- **Cost spikes:** Runaway schedules; mitigated global concurrency caps.
- **Incorrect decisions:** MAP false positives; mitigated dual thresholds and human ack for actions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log fetch outcomes and extractor version; avoid storing unnecessary HTML.
- **Observability:** Block rates, parse success %, freshness histograms, DLQ depth.
- **Rate limiting:** Per-domain politeness; respect robots and terms of service.
- **Retry strategies:** Jittered retries; circuit breakers per domain.
- **Guardrails and validation:** Legal review for target sites; ban lists; PII redaction if pages leak user data.
- **Security considerations:** Secrets for partner APIs, egress allowlists, tenant isolation for agencies.

---

## 🚀 Possible Extensions

- **Add UI:** Competitor matrix heatmaps and promo overlay detection.
- **Convert to SaaS:** Multi-tenant monitors with per-tenant extractors.
- **Add multi-agent collaboration:** Research agent proposes new competitors from news (human-approved).
- **Add real-time capabilities:** Webhook ingestion from partner data shares.
- **Integrate with external systems:** Dynamic pricing engines, ERP, BigQuery.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep **deterministic extraction** as the source of truth for numbers.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Durable scheduling** at scale
  - **Extractor lifecycle** management
  - **Compliance-aware** web automation
  - **System design thinking** for pricing ops
