System Type: Agent  
Complexity: Level 3  
Industry: Marketing  
Capabilities: Prediction  

# Lead Scoring & Qualification Agent

## 🧠 Overview
A **RevOps-facing agent** that scores **leads** and **MQLs** using **tool-backed** CRM fields, **product usage** events, **email/web engagement**, and **firmographics**—outputs are **structured scorecards** with **explainable drivers** and **recommended next actions**, not silent CRM field overwrites without policy.

---

## 🎯 Problem
Sales ignores marketing-qualified leads because scores are opaque or stale; spreadsheets do not update with behavior in real time.

---

## 💡 Why This Matters
- **Pain it removes:** Wasted SDR time, missed high-intent accounts, and inconsistent qualification criteria across regions.
- **Who benefits:** Growth and RevOps teams on **HubSpot**, **Salesforce**, or **Segment + warehouse** stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `fetch_crm_lead`, `query_warehouse_metrics`, `list_campaign_engagement`, `propose_score` (schema-validated).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multi-source retrieval + calibration + human override loops; L4+ adds multi-agent split (research vs scoring) with arbitration.

---

## 🏭 Industry
Example:
- Marketing / revenue operations

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — playbooks, ICP definitions, objection handling snippets
- Planning — bounded (next-best-action sequences)
- Reasoning — bounded (driver explanations)
- Automation — optional CRM field updates within guardrails
- Decision making — bounded (tier assignment)
- Observability — **in scope**
- Personalization — per-segment models and weights
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** BFF
- **OpenAI SDK** tool calling
- **Salesforce** / **HubSpot** APIs, **Segment** or **Snowflake** for events
- **Postgres** for score audit + model version registry
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Lead Scoring & Qualification Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **marketing** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SendGrid / SES / customer.io for outbound
- Meta / Google Ads APIs (only if ads are in-scope)
- YouTube / podcast hosting APIs when media ingestion applies

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

- **Input (UI / API / CLI):** Lead id, batch scoring jobs, Slack `/score-lead`.
- **LLM layer:** Agent composes `LeadScore` JSON with `drivers[]` citing tool rows.
- **Tools / APIs:** CRM reads/writes (scoped), warehouse SQL with RLS, enrichment vendors (contractual).
- **Memory (if any):** Historical overrides for active learning; ICP doc embeddings.
- **Output:** CRM update proposal or human review task.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rule-only score from form fields and company size buckets.

### Step 2: Add AI layer
- LLM narrates rule output for SDRs with no CRM write.

### Step 3: Add tools
- Pull last 30d product events and email engagement aggregates.

### Step 4: Add memory or context
- Log human overrides to reweight features each month (governed pipeline).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional “research agent” for news signals with strict allowlisted domains.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Lift in opportunity creation vs holdout; calibration (Brier) on labeled outcomes.
- **Latency:** p95 score latency for interactive lookups.
- **Cost:** Warehouse scan + LLM $ per 1k leads scored.
- **User satisfaction:** SDR trust surveys; override rate trends.
- **Failure rate:** Wrong account linkage, biased proxies, PII leakage into prompts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented engagement stats; only cite tool-returned metrics.
- **Tool failures:** CRM partial fields; explicit “insufficient data” tier, not guessed highs.
- **Latency issues:** Wide event scans; preaggregate daily lead features in ETL.
- **Cost spikes:** Full-table scans per lead; materialized views keyed by `lead_id`.
- **Incorrect decisions:** Auto-routing VIPs incorrectly; caps + human gates for tier jumps.

---

## 🏭 Production Considerations

- **Logging and tracing:** Model version, feature snapshot hash, redaction stats—not raw emails if policy forbids.
- **Observability:** Override reasons, score distribution drift, API quota health.
- **Rate limiting:** Per tenant and per CRM; backoff on 429.
- **Retry strategies:** Idempotent CRM updates with external keys.
- **Guardrails and validation:** GDPR/marketing consent checks before using behavior; block sensitive attributes per HR/legal.
- **Security considerations:** OAuth scopes, encryption, audit for score changes affecting compensation-adjacent workflows.

---

## 🚀 Possible Extensions

- **Add UI:** Score debugger with SHAP-style drivers (aggregate, not leaky).
- **Convert to SaaS:** Multi-tenant scoring with BYO warehouse.
- **Add multi-agent collaboration:** Compliance reviewer for regulated industries.
- **Add real-time capabilities:** Streaming score refresh on high-value site events.
- **Integrate with external systems:** Clearbit, 6sense, Clay, Outreach/Salesloft.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **explainability + fairness review** before auto-CRM writes.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **RevOps-grade** lead scoring
  - **Warehouse + CRM** agent tools
  - **Calibration and overrides**
  - **System design thinking** for growth engineering
