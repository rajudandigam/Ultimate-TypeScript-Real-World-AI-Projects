System Type: Workflow  
Complexity: Level 2  
Industry: Productivity  
Capabilities: Summarization  

# Slack/Teams Intelligent Summarization System

## 🧠 Overview
A **workflow-first** pipeline that ingests **channel or thread history** (Slack, Microsoft Teams) on a **schedule or keyword trigger**, produces **structured digests** (decisions, owners, deadlines, open questions), and posts them to **destination channels or email**—optional **LLM** steps are **bounded** and **PII-scrubbed** before model calls.

---

## 🎯 Problem
High-volume channels bury decisions; new joiners cannot catch up; manual weekly summaries do not scale across teams.

---

## 💡 Why This Matters
- **Pain it removes:** Context loss and meeting duplication from re-asking answered questions.
- **Who benefits:** Engineering managers, program managers, and incident comms leads.

---

## 🏗️ System Type
**Chosen:** **Workflow** — ingestion, dedupe, chunking, redaction, and delivery are **deterministic** with versioned prompts for summarization.

---

## ⚙️ Complexity Level
**Target:** Level 2 — straightforward connectors plus summarization with guardrails.

---

## 🏭 Industry
Productivity / enterprise collaboration

---

## 🧩 Capabilities
Summarization, Automation, Observability, Personalization (per channel template)

---

## 🛠️ Suggested TypeScript Stack
Node.js, Slack Bolt / Teams Bot Framework, Temporal or Inngest, Postgres state, Presidio-style redaction, OpenAI SDK, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Slack/Teams Intelligent Summarization System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **productivity** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Gmail / Microsoft Graph mail & calendar
- Slack / Teams webhooks & bot APIs
- Notion / Jira / Linear REST

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
OAuth app → fetch messages since cursor → normalize → redact → chunk → summarize steps → validate JSON schema → post summary card with links back to threads

---

## 🔄 Implementation Steps
1. Single channel daily digest  
2. Thread-only mode for noisy channels  
3. Action item extraction with @mention validation  
4. Multi-workspace enterprise install  
5. Opt-out and legal hold aware skipping  

---

## 📊 Evaluation
Human-rated usefulness (1–5), missed-decision rate on labeled threads, redaction recall, digest latency vs channel size

---

## ⚠️ Challenges & Failure Cases
**Summarizing privileged legal threads**; hallucinated owners; broken deep links after retention—workspace policy tags, legal hold connectors, quote-only summaries with permalinks, max-age fetch limits

---

## 🏭 Production Considerations
Tenant-scoped tokens, rate limits, data residency, retention alignment with Slack/Teams export policies, admin audit of what was sent to LLM vendors

---

## 🚀 Possible Extensions
Cross-link to Jira/Asana when detected ticket keys appear in digest

---

## 🔁 Evolution Path
Manual copy-paste → scheduled summaries → policy-aware digests → optional Q&A over last-N-days (separate RAG project)

---

## 🎓 What You Learn
Enterprise chat APIs, PII hygiene for LLMs, durable summarization at scale
