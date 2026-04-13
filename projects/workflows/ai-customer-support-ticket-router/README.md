System Type: Workflow  
Complexity: Level 3  
Industry: Workflows  
Capabilities: Classification  

# AI Customer Support Ticket Router

## 🧠 Overview
A **classification and routing workflow** that scores every ticket (subject, body, metadata, product area signals) into **queues**, **priorities**, and **SLA tiers** using **rules + ML/LLM classifiers**, then **executes** CRM updates through **idempotent** APIs—designed so “AI changed severity” is always **explainable** with **versioned** models and **override** trails.

---

## 🎯 Problem
Manual triage bottlenecks first response time; inconsistent routing frustrates customers and burns specialists. You need **measurable routing quality** and **safe rollbacks** when models drift.

---

## 💡 Why This Matters
- **Pain it removes:** Wrong-team tickets, priority inversions during incidents, and opaque escalations.
- **Who benefits:** B2B SaaS support orgs using Zendesk, Intercom, Jira Service Management, or custom desks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

Routing is **event → features → decision → side effects**. LLM can be one **scoring function** behind the same contract as classical models, not a chatty agent requirement.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-signal classification, **continuous evaluation**, and **shadow mode**—L5 adds enterprise governance, multilingual scale, and incident-aware dynamic routing.

---

## 🏭 Industry
Example:
- Workflows (support operations, CX routing, incident intake)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (known issue snippets for similarity routing)
- Planning — light (re-route on incident flags)
- Reasoning — optional (LLM explains top-3 queues with feature attribution JSON)
- Automation — **in scope** (CRM field updates, notifications)
- Decision making — **in scope** (queue + priority assignment)
- Observability — **in scope**
- Personalization — optional (VIP accounts)
- Multimodal — optional (attach images → separate classifier feeding features)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Inngest** / **Temporal** for ticket lifecycle hooks
- **Postgres** (features, decisions, labels for training)
- **Zendesk/Intercom/JSM APIs**
- **OpenAI SDK** optional for embedding + classifier head
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Customer Support Ticket Router** (Workflow, L3): prioritize components that match **workflow** orchestration and the **workflows** integration surface.

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
Describe the main components:

- **Input (UI / API / CLI):** Ticket webhooks, polling importers, manual requeue UI.
- **LLM layer:** Optional classifier or explainer producing structured `RoutingDecision`.
- **Tools / APIs:** Update ticket fields, notify Slack/PagerDuty, link related incidents.
- **Memory (if any):** Historical routing corrections for active learning (governed).
- **Output:** Routed ticket + audit record + metrics event.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Keyword rules + static team map.

### Step 2: Add AI layer
- Embeddings for nearest known issues to suggest queue (kNN).

### Step 3: Add tools
- Add CRM update tools with schema validation and dry-run mode.

### Step 4: Add memory or context
- Log human overrides as supervised labels for retraining pipeline.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **explainer agent** offline for managers—not on hot path.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Macro-F1 on queue and priority vs human gold set; cost of misroutes.
- **Latency:** p95 routing decision time from ticket creation webhook.
- **Cost:** Embedding + model $ per ticket at volume.
- **User satisfaction:** First response time, reopen rate, CSAT by queue.
- **Failure rate:** Infinite reroute loops, wrong PagerDuty service, VIP mis-prioritization.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Explaining nonexistent features; mitigated by feature JSON from code paths only.
- **Tool failures:** CRM API partial updates; mitigated by outbox + reconciliation jobs.
- **Latency issues:** Cold embedding index; mitigated by warm caches and approximate NN.
- **Cost spikes:** Embedding every internal comment edit; mitigated by debounce and hashing.
- **Incorrect decisions:** Security tickets to general queue; mitigated by keyword-invariant rules, severity floors, and incident mode overrides.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store decision version, feature snapshot hash, and rule hits—not full ticket bodies if policy forbids.
- **Observability:** Confusion matrix drift week-over-week, override rate by team, queue depth alarms.
- **Rate limiting:** Webhook burst handling; backpressure to avoid CRM bans.
- **Retry strategies:** Idempotent ticket updates; dedupe on `external_ticket_id`.
- **Guardrails and validation:** Enums for queues; block routes to deprecated teams; canary new models in shadow.
- **Security considerations:** Tenant isolation for multi-brand desks; least privilege API tokens; PII minimization.

---

## 🚀 Possible Extensions

- **Add UI:** Routing simulator for policy changes before deploy.
- **Convert to SaaS:** Multi-tenant routing with per-tenant model registry.
- **Add multi-agent collaboration:** Separate **security triage** agent with stricter tools (advanced).
- **Add real-time capabilities:** Streaming classification as customer types (careful privacy).
- **Integrate with external systems:** Statuspage incidents, on-call rotations, knowledge bases.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Run **shadow mode** until precision thresholds met for auto-apply.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Operational classification** metrics
  - **Shadow deployments** for routing models
  - **CRM idempotency** patterns
  - **System design thinking** for CX scale
