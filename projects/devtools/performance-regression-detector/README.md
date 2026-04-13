System Type: Workflow  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Monitoring, Analytics  

# Performance Regression Detector

## 🧠 Overview
A **workflow pipeline** that ingests **benchmark artifacts** (k6, Lighthouse CI, custom microbench JSON) and **APM golden traces**, compares against **rolling baselines** with **statistical gates**, and files **regression tickets** with **diff-attribution** links—LLM optional for **natural language summaries** of numeric deltas only.

---

## 🎯 Problem
Perf regressions slip through CI because thresholds are static noise; prod drift is noticed only after customer complaints.

---

## 💡 Why This Matters
- **Pain it removes:** Mystery latency spikes, bloated bundles, and flaky “red but ignored” dashboards.
- **Who benefits:** Frontend and backend teams shipping TypeScript services at high velocity.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Ingest → normalize metrics → baseline model → anomaly decision → notify is inherently orchestration.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-metric correlation + environment stratification + historical seasonality; L5 adds fleet-wide causal analysis with heavy data engineering.

---

## 🏭 Industry
Example:
- DevTools / SRE / frontend platform

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — links to recent PRs touching hot paths
- Planning — bounded (which tests to rerun bisecting)
- Reasoning — optional narrative from structured tables
- Automation — GitHub status checks, ticket creation
- Decision making — bounded (regression yes/no with confidence)
- Observability — **in scope**
- Personalization — per-service SLO weights
- Multimodal — optional filmstrip for Lighthouse regressions

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** ingest API
- **ClickHouse** or **BigQuery** for time-series metrics
- **Temporal**/**Inngest** for compare + bisect workflows
- **stats-ts** or Python sidecar for robust stats if needed
- **OpenTelemetry**, **Grafana**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Performance Regression Detector** (Workflow, L3): prioritize components that match **workflow** orchestration and the **devtools** integration surface.

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

- **Input (UI / API / CLI):** CI uploads, scheduled prod canary probes.
- **LLM layer:** Optional comment generator from tabular diff JSON.
- **Tools / APIs:** Git provider for blame range, bundle analyzer artifacts.
- **Memory (if any):** Baseline store per `(service, scenario, commit)` windows.
- **Output:** PR checks, Slack alerts, bisect jobs.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Single metric threshold on one benchmark in CI.

### Step 2: Add AI layer
- LLM summarizes top regressions for weekly report from CSV.

### Step 3: Add tools
- Pull OTel span breakdowns; attribute latency to service edges.

### Step 4: Add memory or context
- Seasonal baselines (e.g., Black Friday shape) per region.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent proposes bisect steps—executor remains deterministic workflow.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall vs human-labeled regressions on historical data.
- **Latency:** Ingest→decision within CI budget; async path for deep dives.
- **Cost:** Warehouse query $ + CI minutes for bisect replay suites.
- **User satisfaction:** Reduction in escaped regressions; fewer false positives.
- **Failure rate:** Flaky tests flip-flopping baselines; environment skew false alarms.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** If LLM used, must not invent numbers—attach tables only.
- **Tool failures:** Missing spans; degrade to coarser metrics with warning banner.
- **Latency issues:** Heavy trace queries; preaggregate service graphs nightly.
- **Cost spikes:** Bisect storms; cap depth and require manual approval for expensive suites.
- **Incorrect decisions:** CPU noise on shared CI; mitigate with dedicated perf runners and repeated sampling.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store metric tuples + commit SHAs; PII-free spans.
- **Observability:** Detector’s own SLOs, baseline freshness, flake scores per test.
- **Rate limiting:** Per-repo upload caps; dedupe identical artifacts.
- **Retry strategies:** Idempotent uploads keyed by `(repo, commit, scenario)`.
- **Guardrails and validation:** Require minimum sample size before failing builds.
- **Security considerations:** Signed uploads, tenant isolation for proprietary benchmarks.

---

## 🚀 Possible Extensions

- **Add UI:** Flamegraph diff viewer integrated with PRs.
- **Convert to SaaS:** Hosted perf registries with org policies.
- **Add multi-agent collaboration:** FE vs BE specialists debating shared bottlenecks (structured debate log).
- **Add real-time capabilities:** Live shadow traffic comparison (advanced).
- **Integrate with external systems:** Datadog, Honeycomb, Grafana Cloud, Buildkite annotations.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **measurement discipline** before “smart” explanations.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Statistical baselines** for noisy metrics
  - **CI perf** hygiene
  - **Trace-driven** attribution
  - **System design thinking** for developer signal quality
