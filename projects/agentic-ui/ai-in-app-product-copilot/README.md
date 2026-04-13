System Type: Agent  
Complexity: Level 4  
Industry: Agentic UI  
Capabilities: Assistance, Context Awareness  

# AI In-App Product Copilot

## 🧠 Overview
An **embedded product agent** that reads **sanitized application context** (route, feature flags, selected records, visible form schema) from your SaaS client via a **trusted bridge**, suggests **next best actions**, and can **propose** UI operations as **structured intents** your host app validates and executes—so the copilot **never** becomes an uncontrolled remote-control of customer data.

---

## 🎯 Problem
Generic chat sidebars lack page awareness and create unsafe “click here” advice. Real in-app copilots need **schema-bound tools**, **permission parity** with the logged-in user, and **deterministic** execution paths the frontend can audit.

---

## 💡 Why This Matters
- **Pain it removes:** Support load from “where do I click?”, shallow onboarding, and feature discovery gaps.
- **Who benefits:** B2B SaaS teams shipping TypeScript/React products with strict tenant isolation.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

One copilot session maps cleanly to **one user’s entitlements** and **one app surface**. Multi-agent splits rarely help unless isolating **write** tools behind a separate executor service.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. You integrate **context packaging**, **tool allowlists**, **human confirmation** for mutations, and **evaluation** of suggestion quality in production.

---

## 🏭 Industry
Example:
- Agentic UI (in-app copilots, embedded assistants, command palettes with AI)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (in-app help docs, release notes index)
- Planning — bounded (multi-step guided flows)
- Reasoning — bounded (explain why an action is blocked)
- Automation — **in scope** (propose intents: open drawer, prefill filter—not raw DOM clicks)
- Decision making — bounded (rank next actions from analytics-backed templates)
- Observability — **in scope**
- Personalization — optional (role-based playbooks)
- Multimodal — optional (screenshot-to-context with redaction pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **React** + **TypeScript** (host app SDK: context provider + intent dispatcher)
- **Next.js** or **Vite** BFF for copilot sessions
- **Vercel AI SDK** / **OpenAI Agents SDK**
- **Postgres** (session transcripts metadata, not full PII by default)
- **OpenTelemetry** (redacted spans)

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI In-App Product Copilot** (Agent, L4): prioritize components that match **agent** orchestration and the **agentic-ui** integration surface.

- **Next.js + React** — app shell, auth, and streaming UX align with how most TypeScript teams ship user-facing agents.
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
- **CopilotKit** — in-app copilot state, shared context with React, safer UI action wiring.
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

- **Input (UI / API / CLI):** Client sends `AppContext` snapshot (versioned schema) + user question.
- **LLM layer:** Agent emits `CopilotIntent[]` validated against JSON Schema.
- **Tools / APIs:** Server tools mirroring product APIs (same RBAC as REST).
- **Memory (if any):** Short session summary; optional org-specific doc RAG.
- **Output:** Host renders intents or asks clarifying questions; all mutations go through app code.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static help panel keyed by route; no model.

### Step 2: Add AI layer
- LLM answers from route id + fixed FAQ strings only.

### Step 3: Add tools
- Add read-only tools: fetch record, list fields, explain validation error codes.

### Step 4: Add memory or context
- Add session summary across steps within one workspace visit.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional executor microservice for write intents with idempotency keys.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Intent validity rate (rejected by host validator); task completion on labeled journeys.
- **Latency:** p95 time to first token / first intent under typical context size.
- **Cost:** Tokens per active seat per day.
- **User satisfaction:** Feature adoption, support ticket reduction, qualitative ease scores.
- **Failure rate:** Wrong navigation suggestions, permission leaks, UX dead-ends.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented menu paths; mitigated by intent catalog + server-side route existence checks.
- **Tool failures:** API errors mid-flow; mitigated by structured error propagation to the model and user.
- **Latency issues:** Huge context payloads; mitigated by summarization tiers and field allowlists.
- **Cost spikes:** Logging full page HTML to the model; mitigated by strict context contracts and hashing.
- **Incorrect decisions:** Suggesting bulk delete or export; mitigated by capability tiers, confirmations, and rate limits.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log intent types and outcomes, not customer record payloads by default.
- **Observability:** Tool error taxonomy, permission denials, model refusal rates, client SDK version drift.
- **Rate limiting:** Per tenant and per user; detect automated probing of tools.
- **Retry strategies:** Idempotent server tools; safe replay for client network blips.
- **Guardrails and validation:** JSON Schema validation on every intent; CSP and iframe policies for embedded widgets.
- **Security considerations:** Tenant isolation, OAuth scopes, prompt-injection defenses (sanitize user-controlled labels in context), SOC2 readiness.

---

## 🚀 Possible Extensions

- **Add UI:** Command palette with fuzzy actions + natural language.
- **Convert to SaaS:** Copilot platform with per-tenant tool packs and analytics.
- **Add multi-agent collaboration:** Separate “data analyst” read-only agent for SQL-heavy modules.
- **Add real-time capabilities:** Streaming partial intents for responsive UX.
- **Integrate with external systems:** Salesforce, HubSpot, internal admin APIs via MCP.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start **read-only** suggestions; add writes only with receipts and confirmations.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Intent-based** UI automation vs brittle DOM scraping
  - **Permission parity** between UI and agent tools
  - **Context contracts** between client and model
  - **System design thinking** for embedded AI in products
