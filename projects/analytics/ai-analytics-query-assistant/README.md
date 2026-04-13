System Type: Agent  
Complexity: Level 4  
Industry: Analytics  
Capabilities: Retrieval, Query Generation  

# AI Analytics Query Assistant

## 🧠 Overview
A **governed analytics agent** that converts controlled natural language into **parameterized SQL** (or metric DSL), executes queries through a **trusted execution layer** with **row-level security**, and returns **results plus explanations**—with enough observability to debug “why this number” without turning analysts into DBAs.

---

## 🎯 Problem
Self-serve analytics stalls because SQL is hard, semantic layers are incomplete, and NL→SQL demos ignore **permissions**, **cost**, and **correctness**. A production system must enforce **tenant isolation**, **query budgets**, and **schema grounding**—not ship a chatbot with raw `SELECT *` power.

---

## 💡 Why This Matters
- **Pain it removes:** Slow ad-hoc requests to data teams, inconsistent metric definitions, and risky copy-paste SQL in notebooks.
- **Who benefits:** Product analysts, growth teams, and internal BI portals where governed self-serve is a requirement, not a nice-to-have.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

An analytics session is typically **one thread** of iterative refinement: clarify intent, propose query, execute, explain. Multi-agent is optional later (semantic layer curator vs executor) but adds coordination overhead early.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4 in **system maturity** (semantic contracts, eval harnesses, strong governance)—even with a **single agent**—because the product is closer to **data platform engineering** than casual chat.

---

## 🏭 Industry
Example:
- Analytics (BI self-serve, metrics layers, internal data portals)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (metric definitions, glossary, prior approved queries)
- Planning — **in scope** (query plan decomposition)
- Reasoning — bounded (interpretation of results with uncertainty)
- Automation — optional (save chart to mode/dashboard)
- Decision making — bounded (choose metric version, grain)
- Observability — **core**
- Personalization — optional (team-specific defaults)
- Multimodal — optional (chart image as additional context)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (query UI, visualization)
- **Node.js + TypeScript**
- **OpenAI Agents SDK** / **Vercel AI SDK**
- **Snowflake / BigQuery / Postgres** via server-side drivers only
- **dbt** metadata or **Cube/MetricFlow** semantic APIs where available
- **OpenTelemetry**, **query audit tables**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Analytics Query Assistant** (Agent, L4): prioritize components that match **agent** orchestration and the **analytics** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo.
- **Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it.
- **Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Natural language question + `workspace_id` + optional saved context (dashboard, filter set).
- **LLM layer:** Agent proposes SQL/DSL as structured AST or parameters, never opaque string execution without validation.
- **Tools / APIs:** `list_tables` (allowlisted), `describe_metric`, `run_query` (wrapped), `explain_plan`, `export_csv` (gated).
- **Memory (if any):** Retrieve approved query templates and metric docs; session memory for iterative refinements.
- **Output:** Result set (bounded rows), chart spec, explanation tied to metric definitions and query text used.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Prebuilt query templates with parameters only; no free-form SQL.

### Step 2: Add AI layer
- LLM maps questions to template ids + parameters; strict validation.

### Step 3: Add tools
- Add schema exploration tools with heavy allowlisting; add EXPLAIN-first path.

### Step 4: Add memory or context
- RAG over glossary and prior analyst-approved queries; lineage tags for metric versions.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional secondary **semantic validator** agent that only checks metric consistency—merge via deterministic gate.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Execution match to gold SQL on benchmark questions; business correctness reviews.
- **Latency:** p95 end-to-end for interactive questions under warehouse budgets.
- **Cost:** Warehouse slots scanned per question; saved vs ad-hoc analyst time.
- **User satisfaction:** Repeat usage, thumbs on explanations, reduction in ad-hoc tickets.
- **Failure rate:** Blocked unsafe queries, timeouts, wrong grain joins caught by tests.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong joins or metrics; mitigated by semantic layer constraints, AST validation, and golden tests.
- **Tool failures:** Warehouse cold starts, auth errors; mitigated by retries and user-visible diagnostics.
- **Latency issues:** Full table scans from bad SQL; mitigated by EXPLAIN gates, limits, and partition hints from metadata tools.
- **Cost spikes:** Analyst loops re-running huge queries; mitigated by per-user budgets and diff-based caching of identical queries.
- **Incorrect decisions:** Data leaks across tenants; mitigated by **mandatory** RLS-enforced roles, never concatenating raw user SQL into execution.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log query fingerprints and row counts, not raw PII result sets by default.
- **Observability:** Dashboards for blocked queries, scan bytes, model/tool errors, cache hit rate.
- **Rate limiting:** Per user, per team, per warehouse warehouse slot policy.
- **Retry strategies:** Safe read retries; no blind retry on partial failures that could double-charge.
- **Guardrails and validation:** Allowlisted relations, max date windows, mandatory filters for large tables, export policies.
- **Security considerations:** SSO, impersonation to RLS roles, query audit for compliance, prompt injection defenses against malicious schema descriptions.

---

## 🚀 Possible Extensions

- **Add UI:** Visual query plan diff and metric lineage panel.
- **Convert to SaaS:** Multi-tenant semantic packs with customer-managed keys.
- **Add multi-agent collaboration:** Metric owner agent vs query executor with separation of duties.
- **Add real-time capabilities:** Streaming results for large aggregates with progressive refinement.
- **Integrate with external systems:** Mode/Lightdash/Looker, Slack digests with signed deep links.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Expand from templates to constrained SQL only after validation and monitoring mature.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Governed NL→SQL** with RLS and budgets
  - **Semantic layers** as contracts between model and warehouse
  - **Evaluation** for analytics assistants (gold sets, regression in CI)
  - **System design thinking** for trustworthy data access
