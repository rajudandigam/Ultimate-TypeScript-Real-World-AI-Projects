System Type: Workflow  
Complexity: Level 2  
Industry: Productivity  
Capabilities: Aggregation  

# Project Status Aggregation System

## 🧠 Overview
**Scheduled workflows** pull **normalized work items** from **Jira**, **Linear**, **GitHub Issues/Projects**, and **CI status**, then materialize **rollup views** (team, initiative, milestone) and **executive summaries**—optional **LLM narrative** is generated **only** from structured JSON rollups, not raw ticket dumps, to control cost and hallucination risk.

---

## 🎯 Problem
Leaders cannot see cross-tool truth; status meetings devolve into manual slide updates and stale spreadsheets.

---

## 💡 Why This Matters
- **Pain it removes:** Fragmented visibility, surprise slips, and engineer time lost to status chores.
- **Who benefits:** Engineering managers, PMs, and EPMOs in multi-tool stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

ETL + aggregation + notifications are deterministic pipelines; LLM is optional **last mile** prose.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Connectors + rollups + reports; L3+ adds predictive risk scoring and richer semantic clustering of blockers.

---

## 🏭 Industry
Example:
- Productivity / engineering management

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional narrative style guides
- Planning — bounded (report sections)
- Reasoning — optional LLM summary from tables only
- Automation — **in scope** (cron, Slack/Email delivery)
- Decision making — bounded (red/yellow/green rules from SLOs)
- Observability — **in scope**
- Personalization — per-audience report templates
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Temporal** / **Inngest** for schedules
- **Node.js + TypeScript** connector SDKs (Linear, Jira REST, GitHub)
- **Postgres** as reporting warehouse
- **OpenAI SDK** optional for summaries
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Project Status Aggregation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **productivity** integration surface.

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

- **Input (UI / API / CLI):** Connector credentials, mapping config, schedule definitions.
- **LLM layer:** Optional “exec summary” from rollup JSON.
- **Tools / APIs:** Issue trackers, Git PR APIs, CI dashboards APIs.
- **Memory (if any):** Historical snapshots for trend charts.
- **Output:** Web dashboards, PDF/Slack blocks, email digests.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- One connector → single table → CSV export.

### Step 2: Add AI layer
- LLM writes 5 bullets from a single JSON rollup object.

### Step 3: Add tools
- Add second connector with idempotent upsert keys for issues.

### Step 4: Add memory or context
- Store weekly snapshots for burndown and lead time trends.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent answers ad-hoc questions via read-only SQL over warehouse.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Rollup matches source-of-truth spot checks; SLA on data freshness.
- **Latency:** Time from source change to dashboard update within SLO.
- **Cost:** Connector API calls + warehouse + optional LLM $ per report.
- **User satisfaction:** Reduced status meeting length; trust in dashboards.
- **Failure rate:** Duplicate issues, wrong epic mapping, rate limit outages.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** If LLM used, never feed it unstructured giant exports—tables only.
- **Tool failures:** Partial sync; show “stale since” banners, not silent wrong greens.
- **Latency issues:** Full re-sync; incremental webhooks + cursor-based pulls.
- **Cost spikes:** Hourly full scans; backoff and event-driven updates.
- **Incorrect decisions:** Misconfigured field mappings mislead execs; schema validation + dry-run mode.

---

## 🏭 Production Considerations

- **Logging and tracing:** Sync cursor positions, connector error taxonomy.
- **Observability:** Freshness histograms, rows processed/sec, DLQ depth.
- **Rate limiting:** Respect vendor quotas; global per-connector concurrency.
- **Retry strategies:** Exponential backoff; poison webhook isolation.
- **Guardrails and validation:** PII minimization in summaries; role-based report scopes.
- **Security considerations:** Scoped OAuth, per-tenant encryption, audit of who viewed exec reports.

---

## 🚀 Possible Extensions

- **Add UI:** Initiative map with dependency risk overlay.
- **Convert to SaaS:** Multi-tenant EPMO hub.
- **Add multi-agent collaboration:** PM agent + eng agent debate “true critical path” with logged evidence.
- **Add real-time capabilities:** Webhook-driven near-real-time for war rooms.
- **Integrate with external systems:** BigQuery, Looker, Notion, Confluence auto-publish.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **data freshness + mapping correctness** before narrative autonomy.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multi-tool ETL** for engineering work
  - **Rollup** modeling across trackers
  - **Executive reporting** with governance
  - **System design thinking** for operational visibility
