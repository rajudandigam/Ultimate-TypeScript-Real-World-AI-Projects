System Type: Workflow  
Complexity: Level 3  
Industry: Legal / Compliance  
Capabilities: Monitoring  

# Regulatory Change Impact Analyzer

## 🧠 Overview
**Ingestion workflows** monitor **regulatory feeds** (RSS, official APIs, paid trackers), **normalize** updates into **change records**, **diff** against your **internal control library** (policies, product features, data maps), and route **impact assessments** to owners—LLM assists **mapping suggestions** only with **citations** to source text and **human sign-off** before any control change is recorded as approved.

---

## 🎯 Problem
Compliance teams learn about rule changes late; manual scanning does not scale across **jurisdictions** and **product surfaces**.

---

## 💡 Why This Matters
- **Pain it removes:** Missed filing deadlines, rushed product changes, and audit findings from stale control registers.
- **Who benefits:** Legal, GRC, and product policy leads in regulated software and fintech.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Scheduled fetch, dedupe, ticketing, and SLA escalations are durable workflows; optional agent assists triage queues.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Feed ingestion + semantic match to internal corpus + review workflow; L5 adds enterprise-wide control graph automation with formal signatories and evidence chains.

---

## 🏭 Industry
Example:
- Legal / compliance / GRC

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal policies, control library, past assessments
- Planning — bounded (impact rollout plan drafts)
- Reasoning — bounded (mapping proposals with citations)
- Automation — ticket routing, reminders
- Decision making — bounded (severity tier suggestion)
- Observability — **in scope**
- Personalization — per-jurisdiction watchlists
- Multimodal — PDF/HTML sources from regulators

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** workers
- **Temporal** / **Inngest** for schedules
- **Postgres** + **pgvector** for semantic match to controls
- **OpenAI SDK** optional for structured “impact draft”
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Regulatory Change Impact Analyzer** (Workflow, L3): prioritize components that match **workflow** orchestration and the **legal** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- E-signature provider APIs (DocuSign, Dropbox Sign)
- DMS / CMS search APIs
- Court / filing portals only where licensed

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

- **Input (UI / API / CLI):** Source registry, subscription tiers, owner matrix.
- **LLM layer:** Proposes affected controls with `citation[]` to source clauses.
- **Tools / APIs:** Feed fetchers, document parsers, ticketing (Jira/ServiceNow).
- **Memory (if any):** Versioned control register; assessment history.
- **Output:** Impact tickets, executive summaries, audit export packages.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual paste of regulation text + keyword match to control IDs.

### Step 2: Add AI layer
- LLM labels section topics for humans only.

### Step 3: Add tools
- Automated feeds + dedupe by content hash and official id.

### Step 4: Add memory or context
- Embeddings over internal policies; track mapping confidence scores.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist agents per domain (privacy vs financial promos) with merge review.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human acceptance rate of proposed mappings on labeled updates.
- **Latency:** Time from publication to first triaged ticket.
- **Cost:** Feed licenses + compute + LLM per change record.
- **User satisfaction:** GRC team trust; fewer missed deadlines in audits.
- **Failure rate:** False matches, missed jurisdictional scope, hallucinated citations.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented clauses; require source URLs + quoted spans validated by fetch checksum.
- **Tool failures:** Feed downtime; explicit staleness banners, not silent “no impact.”
- **Latency issues:** Large PDFs; chunked OCR/index pipeline async from interactive triage.
- **Cost spikes:** Re-embedding entire corpus per update; incremental index updates only.
- **Incorrect decisions:** Auto-closing tickets as “no impact” without human review for high-severity sources.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable evidence attachments; legal hold support.
- **Observability:** Ingest lag, parse failures, SLA to owner ack, override reasons.
- **Rate limiting:** Respect publisher robots/terms; backoff on 429.
- **Retry strategies:** Idempotent upserts of `change_record_id`.
- **Guardrails and validation:** Jurisdiction scoping; separation of duties on approvals; export redaction for third parties.
- **Security considerations:** Access control for unreleased product maps, encryption, vendor DPAs for licensed feeds.

---

## 🚀 Possible Extensions

- **Add UI:** Diff viewer for regulation text vs prior version with control overlays.
- **Convert to SaaS:** Multi-tenant regulatory radar.
- **Add multi-agent collaboration:** Regional counsel agent with locale-specific prompts (still human-approved).
- **Add real-time capabilities:** Push alerts for emergency bulletins.
- **Integrate with external systems:** OneTrust, Archer, Workiva, Vanta for control sync.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **citation integrity** and **human approval** before widening automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Regulatory change** operations
  - **Control libraries** as living data
  - **Evidence-first** AI in legal contexts
  - **System design thinking** for GRC engineering
