System Type: Agent  
Complexity: Level 3  
Industry: Customer Support  
Capabilities: Prediction  

# Customer Journey Intelligence Agent

## 🧠 Overview
A **journey analytics agent** that queries **event warehouses** (product usage, billing, support tickets, NPS) via tools and produces **churn/friction risk scores** with **explainable drivers**—“because **ticket volume + failed payments + feature X drop**”—not black-box scores sent to sales without audit.

---

## 🎯 Problem
CX and CS teams see tickets but miss **leading indicators** in product behavior; churn surprises leadership after it is too late to intervene.

---

## 💡 Why This Matters
- **Pain it removes:** Reactive saves, mis-targeted outreach, and noisy “health scores” nobody trusts.
- **Who benefits:** Customer success and support leaders in PLG and hybrid B2B motions.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The model interprets **tool-aggregated** features; training/scoring can be classical ML with LLM as explainer layer.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-source queries + RAG over playbooks + narrative; L4+ adds multi-agent segmentation (SMB vs enterprise) with governance.

---

## 🏭 Industry
Example:
- Customer support / customer success analytics

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — saved segment definitions, playbooks
- Planning — bounded (investigation plans per account)
- Reasoning — bounded (driver explanations)
- Automation — optional CRM field updates (human-gated)
- Decision making — bounded (risk tier suggestion)
- Observability — **in scope**
- Personalization — per-vertical risk models
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** BFF
- **OpenAI SDK** tool calling
- **Snowflake/BigQuery** or **ClickHouse** SQL tools
- **Salesforce/HubSpot** read APIs
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Customer Journey Intelligence Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **support** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
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

- **Input (UI / API / CLI):** Account id, cohort question, or “top at-risk this week.”
- **LLM layer:** Agent composes SQL/feature requests and explains results.
- **Tools / APIs:** Warehouse, CRM, product analytics, support ticket search.
- **Memory (if any):** Cached feature snapshots per account day.
- **Output:** Risk tier + drivers + recommended plays (non-binding).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static SQL dashboard of leading indicators.

### Step 2: Add AI layer
- LLM explains a single account’s metric row JSON.

### Step 3: Add tools
- Parameterized SQL templates with guardrails; row limits.

### Step 4: Add memory or context
- Store model cards and calibration notes for trust.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional separate “outreach writer” agent with stricter PII policy.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall vs historical churn labels; calibration curves.
- **Latency:** p95 interactive account brief under analyst SLO.
- **Cost:** Warehouse scan bytes + LLM tokens.
- **User satisfaction:** CSM trust scores; reduced false alarms.
- **Failure rate:** Wrong account cohort, discriminatory proxies, data leakage in summaries.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Cites nonexistent spikes; require numeric tables in context with citations.
- **Tool failures:** Warehouse timeout; partial brief with explicit gaps.
- **Latency issues:** Wide scans; precomputed daily features for hot paths.
- **Cost spikes:** Analyst loops; enforce budgets and materialized views.
- **Incorrect decisions:** Automated punitive outreach from shaky scores; human approval for actions.

---

## 🏭 Production Considerations

- **Logging and tracing:** Query fingerprints, redaction logs, model version for each score.
- **Observability:** Drift monitors, bias/fairness metrics where applicable, override tracking.
- **Rate limiting:** Per analyst and per tenant query budgets.
- **Retry strategies:** Safe read retries; no writes without explicit tool scope.
- **Guardrails and validation:** Block sensitive demographic features per policy; legal review for EU contexts.
- **Security considerations:** Row-level security in warehouse, SSO, audit exports for regulators.

---

## 🚀 Possible Extensions

- **Add UI:** Account timeline with annotated driver events.
- **Convert to SaaS:** Journey intelligence product for CS platforms.
- **Add multi-agent collaboration:** Product analytics agent + support agent merged report.
- **Add real-time capabilities:** Streaming feature updates for digital-first accounts.
- **Integrate with external systems:** Gainsight, ChurnZero, Mixpanel, Amplitude.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **transparent features** before opaque model scores.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Explainable** health scoring
  - **Warehouse-grounded** agents
  - **CS playbooks** tied to data
  - **System design thinking** for revenue-adjacent analytics
