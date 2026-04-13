System Type: Workflow  
Complexity: Level 2  
Industry: Education  
Capabilities: Prediction  

# Student Engagement Prediction System

## 🧠 Overview
**Scheduled workflows** compute **engagement features** (LMS logins, video watch %, assignment on-time rates, discussion participation) and apply **transparent rules + calibrated models** to flag **at-risk students** for **advisor outreach**—outputs are **signals**, not disciplinary decisions; **FERPA** governs data minimization and **appeal** pathways.

---

## 🎯 Problem
Dropout risk is visible too late; instructors lack a **privacy-respecting** early warning layer grounded in **LMS facts**.

---

## 💡 Why This Matters
- **Pain it removes:** Silent disengagement, inequitable support allocation, and reactive retention campaigns.
- **Who benefits:** Advising offices and instructors in online and hybrid programs.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Nightly ETL, feature materialization, scoring, and notifications are pipelines; optional LLM drafts **advisor email templates** from structured risk JSON only.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Feature engineering + simple models/rules + reporting; L3+ adds richer sequences and fairness-aware ML with institutional review boards.

---

## 🏭 Industry
Example:
- Education / student success technology

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — advising playbooks (internal)
- Planning — bounded (outreach cadence suggestions)
- Reasoning — optional NL explanation from feature tables only
- Automation — advisor notifications (policy gated)
- Decision making — bounded (risk tier assignment)
- Observability — **in scope**
- Personalization — per-program thresholds
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Inngest** / **Temporal** for schedules
- **Node.js + TypeScript** ETL
- **Snowflake/BigQuery/Postgres** warehouse
- **Canvas/Blackboard** data exports or APIs
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Student Engagement Prediction System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **education** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

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

- **Input (UI / API / CLI):** LMS exports, xAPI events, SIS enrollment snapshots (scoped).
- **LLM layer:** Optional template writer fed only `(student_id, risk_tier, drivers[])`.
- **Tools / APIs:** LMS/SIS connectors (read-first), email/SMS gateways with consent flags.
- **Memory (if any):** Feature tables + model registry; audit of tier changes.
- **Output:** Advisor caseload lists, CRM tasks, anonymized cohort dashboards.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rule: missed 2 consecutive assignments → flag.

### Step 2: Add AI layer
- LLM drafts advisor outreach from explicit bullet facts.

### Step 3: Add tools
- Ingest clickstream aggregates with differential privacy options for dashboards.

### Step 4: Add memory or context
- Track intervention outcomes to recalibrate thresholds each term.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent suggests **resource links** from curated catalog only.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall vs eventual dropout labels (careful base rates).
- **Latency:** Freshness of risk scores after nightly ETL.
- **Cost:** Warehouse + optional LLM for templates.
- **User satisfaction:** Advisor qualitative feedback; reduced false alarm fatigue.
- **Failure rate:** Bias against part-time students, wrong cohort inclusion, notification fatigue.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Irrelevant if LLM only sees structured drivers; never invent grades.
- **Tool failures:** Missing LMS export; mark cohort stale; do not send silent wrong flags.
- **Latency issues:** Late files; SLA alerts to data engineering, not risky defaults.
- **Cost spikes:** Reprocessing full history; incremental merges keyed by `event_id`.
- **Incorrect decisions:** Stigmatizing labels visible to peers; strict RBAC and private advisor views only.

---

## 🏭 Production Considerations

- **Logging and tracing:** Tier changes with model version; avoid logging sensitive notes in plaintext.
- **Observability:** Data freshness, join error rates, intervention completion metrics.
- **Rate limiting:** Notification caps per student per week; consent checks.
- **Retry strategies:** Idempotent ETL loads; safe replays after schema migrations.
- **Guardrails and validation:** Institutional IRB/ethics review for certain uses; opt-out handling.
- **Security considerations:** FERPA, least-privilege SIS scopes, encryption, retention schedules.

---

## 🚀 Possible Extensions

- **Add UI:** Advisor cockpit with explainable drivers and intervention templates.
- **Convert to SaaS:** Multi-tenant student success platform module.
- **Add multi-agent collaboration:** Separate “resource recommender” with hard allowlist links.
- **Add real-time capabilities:** Near-real-time triggers on login absence streaks (careful UX).
- **Integrate with external systems:** Salesforce Education Cloud, Civitas, Starfish.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **measurement fairness + privacy** before widening automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Educational data** governance
  - **Early alert** system design
  - **Calibration** with human outcomes
  - **System design thinking** for ethical student analytics
