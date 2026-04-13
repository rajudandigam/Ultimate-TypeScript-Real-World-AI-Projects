System Type: Workflow  
Complexity: Level 2  
Industry: DevTools  
Capabilities: Translation  

# Natural Language ↔ SQL Engine

## 🧠 Overview
A **workflow-backed NL⇄SQL service**: **schema introspection** and **row-level security** policies produce a **constrained prompt**; the model emits **AST or SQL** that passes through a **static validator** and **read-only execution** tier by default. **SQL → NL** uses **EXPLAIN** + result **samples** (aggregated) to generate summaries—no free-text execution on arbitrary strings.

---

## 🎯 Problem
Ad-hoc “chat with your database” demos become **SQL injection** and **data exfiltration** incidents; analysts still want faster iteration than writing boilerplate SQL.

---

## 💡 Why This Matters
- **Pain it removes:** Slow ad-hoc querying, inconsistent SQL style, and opaque reports for stakeholders.
- **Who benefits:** Internal analytics teams and product engineers behind **governed** data marts.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Request lifecycle—authZ, parse, validate, execute (or refuse), log—is a **pipeline**; the LLM is one **replaceable** stage with hard gates.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Schema tools + validator + execution sandbox; L3+ adds doc RAG over metrics definitions and self-correction loops as an inner agent.

---

## 🏭 Industry
Example:
- DevTools / analytics engineering

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — metric definitions, glossary
- Planning — bounded (join path selection)
- Reasoning — bounded (clarifying questions)
- Automation — scheduled report generation
- Decision making — bounded (allow/deny query class)
- Observability — **in scope**
- Personalization — saved semantic views per role
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** API
- **sqlglot** (via WASM or Python sidecar) or **pg-query-parser** for AST validation
- **Postgres** RLS + restricted roles
- **OpenAI SDK** for generation with **structured outputs**
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Natural Language ↔ SQL Engine** (Workflow, L2): prioritize components that match **workflow** orchestration and the **devtools** integration surface.

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

- **Input (UI / API / CLI):** NL question + tenant + warehouse selection.
- **LLM layer:** Generates candidate SQL or relational AST JSON.
- **Tools / APIs:** `list_tables`, `get_columns`, `validate_sql`, `run_readonly` (limits).
- **Memory (if any):** Short session clarifications; glossary embeddings.
- **Output:** SQL + optional chart spec + natural language summary.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template SQL per canned question ids.

### Step 2: Add AI layer
- LLM fills slots in parameterized query templates only.

### Step 3: Add tools
- Schema introspection; AST validator rejecting non-SELECT unless explicitly enabled.

### Step 4: Add memory or context
- Metric doc RAG with citations in NL answers.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Inner agent self-corrects on validator errors up to N times.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Executable rate; result match vs analyst gold queries on benchmark.
- **Latency:** p95 NL→result for bounded warehouses.
- **Cost:** Tokens + warehouse scan bytes.
- **User satisfaction:** Self-serve success without DBA tickets.
- **Failure rate:** Hallucinated columns, cartesian explosions, policy bypass attempts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Columns that do not exist; AST validator must hard-fail.
- **Tool failures:** Warehouse timeouts; return partial with explicit cancel.
- **Latency issues:** Wide scans; enforce `LIMIT`, partition filters, and cost estimator gate.
- **Cost spikes:** User loops “try again”; per-user daily caps.
- **Incorrect decisions:** Wrong joins producing plausible wrong numbers—require **grain checks** and disclaimers.

---

## 🏭 Production Considerations

- **Logging and tracing:** Query fingerprints, never raw PII in LLM logs where forbidden.
- **Observability:** Blocked query reasons, validator reject taxonomy, row counts returned.
- **Rate limiting:** Per user/group; query cost budgets.
- **Retry strategies:** Safe replays for read queries only.
- **Guardrails and validation:** RLS mandatory; deny subqueries crossing blocked schemas; allowlist functions.
- **Security considerations:** Separate DB roles, SSO, field-level classification, SOC2 audit trails.

---

## 🚀 Possible Extensions

- **Add UI:** SQL side-by-side with NL; “why this join” explainer from AST.
- **Convert to SaaS:** Multi-tenant semantic layer product.
- **Add multi-agent collaboration:** “Metric owner” agent approves new measures.
- **Add real-time capabilities:** Streaming results for large aggregates (careful).
- **Integrate with external systems:** dbt docs, Cube.dev, Lightdash, Hex.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **validator + RLS** before any write-capable paths.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Governed** text-to-SQL
  - **AST validation** patterns
  - **Warehouse cost** control
  - **System design thinking** for data access copilots
