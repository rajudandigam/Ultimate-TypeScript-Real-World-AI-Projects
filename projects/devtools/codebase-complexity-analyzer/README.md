System Type: Workflow  
Complexity: Level 2  
Industry: DevTools  
Capabilities: Analysis  

# Codebase Complexity Analyzer

## 🧠 Overview
A **scheduled workflow** that ingests **static analysis metrics** (cyclomatic complexity, dependency graph stats, churn from git) and surfaces **trend lines** and **refactoring hotspots**—deterministic scoring first, optional **LLM commentary** only on aggregated dashboards so numbers stay authoritative.

---

## 🎯 Problem
Complexity creeps in silently; teams lack a single view tying **historical trends** to **ownership** and **release risk** before a big refactor.

---

## 💡 Why This Matters
- **Pain it removes:** Surprise “unmaintainable” modules, unclear where to invest refactor budget, and noisy one-off linter runs without baselines.
- **Who benefits:** Platform and staff engineers stewarding TypeScript monorepos.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Nightly jobs, diff detection, and artifact storage are **durable workflows**; LLM is optional for **summaries**, not for raw metric computation.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Parser + graph metrics + time-series storage; L3+ adds cross-repo coupling and ML-based hotspot ranking.

---

## 🏭 Industry
Example:
- DevTools / engineering effectiveness

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional ADR snippets for hotspot context
- Planning — bounded (weekly digest scope)
- Reasoning — optional narrative from charts only
- Automation — **in scope** (CI uploads, scheduled recompute)
- Decision making — bounded (threshold alerts)
- Observability — **in scope**
- Personalization — per-team views and CODEOWNERS mapping
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** ingest API
- **ts-morph** / **eslint** JSON reports / **madge** for graphs
- **Postgres** or **ClickHouse** for metric time series
- **Temporal** / **Inngest** for schedules
- **OpenTelemetry**, **Grafana**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Codebase Complexity Analyzer** (Workflow, L2): prioritize components that match **workflow** orchestration and the **devtools** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- GitHub / GitLab / Azure DevOps REST APIs
- CI provider APIs (GitHub Actions, CircleCI)
- Package registry APIs where relevant

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

- **Input (UI / API / CLI):** CI posts JSON bundles per commit; web UI for exploration.
- **LLM layer:** Optional digest writer fed only aggregated tables.
- **Tools / APIs:** Git provider for churn; package manifest readers.
- **Memory (if any):** Metric store keyed by `(repo, commit, path)`.
- **Output:** Dashboards, Slack digests, “top regressions this week.”

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single ESLint complexity report uploaded manually.

### Step 2: Add AI layer
- LLM summarizes top 10 worsened files from CSV.

### Step 3: Add tools
- Automate ingest on default branch merges; link CODEOWNERS.

### Step 4: Add memory or context
- Baseline windows (trailing 90d) and anomaly detection on deltas.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent answers “why did X spike?” using read-only metric tools.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Metric parity with local reruns; hotspot overlap with human picks.
- **Latency:** Ingest + aggregate under CI post-merge budget.
- **Cost:** Storage + compute per repo-month.
- **User satisfaction:** Teams act on digests; reduced surprise refactors.
- **Failure rate:** Wrong file attribution, double-counted modules in workspaces.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** If LLM used, must not invent numbers—attach tables only.
- **Tool failures:** Partial CI uploads; mark datasets incomplete rather than fabricating trends.
- **Latency issues:** Huge repos; incremental per-package analysis and sampling.
- **Cost spikes:** Full-tree analysis every commit; diff-aware incremental passes.
- **Incorrect decisions:** Blaming wrong owner when CODEOWNERS is stale; refresh rules and show confidence.

---

## 🏭 Production Considerations

- **Logging and tracing:** Commit SHAs, parser versions; avoid leaking secrets from scanned paths.
- **Observability:** Ingest lag, parse failure rate, dashboard query performance.
- **Rate limiting:** Per-org uploads; reject oversized artifacts.
- **Retry strategies:** Idempotent upserts by `(repo, commit, tool_version)`.
- **Guardrails and validation:** Schema-validate incoming JSON; quarantine malformed bundles.
- **Security considerations:** Private repo tokens scoped read-only; tenant isolation for agencies.

---

## 🚀 Possible Extensions

- **Add UI:** Treemap of complexity × churn.
- **Convert to SaaS:** Multi-tenant complexity product with org policies.
- **Add multi-agent collaboration:** “Refactor planner” separate from metrics (governed).
- **Add real-time capabilities:** PR annotations on complexity delta only.
- **Integrate with external systems:** SonarQube, CodeClimate, Linear/Jira linking.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **repeatable metrics** before conversational explanations.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Time-series** quality signals for code
  - **Monorepo** measurement pitfalls
  - **Workflow-driven** developer analytics
  - **System design thinking** for trustworthy engineering metrics
