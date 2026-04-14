System Type: Agentic UI
Complexity: L4
Industry: Product / Analytics (AG-UI)
Capabilities: Reasoning, UI interaction, Insights, Streaming

# AI Product Analytics Copilot Dashboard

## 🧠 Overview
PMs and growth teams steer live charts while a CopilotKit-bound agent explains KPI movement, proposes next diagnostic views, and stays grounded in warehouse facts the user can access.

---

## 🎯 Problem
Passive dashboards force users into side-channel chat with screenshots—losing lineage, permissions, and reproducible analysis.

---

## 💡 Why This Matters
- Removes slow RCA loops and ungoverned 'export to ChatGPT' habits.
- Fits teams shipping TypeScript analytics products with strict ACLs.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
Product / Analytics (AG-UI)

---

## 🧩 Capabilities
Reasoning, UI interaction, Insights, Streaming

---

## AG-UI Interaction Model
User: hovers KPIs, selects cohorts, toggles compare windows.
AI: CopilotKit panel + inline chart actions; proposes structured ChartPatch previews, never silent rewrites.
Decisions: ranked hypotheses with confidence + SQL/metric lineage links.
Overrides: reject/rollback/pin explanation to Slack with redacted snapshot.
Trust: show sample sizes, freshness, and allowlisted queries behind every number.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- CopilotKit + Vercel AI SDK for selection-bound streaming.
- Next.js + Tailwind + TanStack Query + Zustand.
- OpenAI Agents SDK with Zod tools: metric catalog, template SQL, Vega-Lite proposals.
- Postgres + pgvector for glossary; Redis for query fingerprints.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Product Analytics Copilot Dashboard** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Snowflake / BigQuery / Databricks (read-only roles)
- dbt or Cube/MetricFlow metadata
- Slack/Teams for sharing explanations

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- LangChain.js (optional multi-retriever)
- Cube or semantic layer toolkits when needed

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Vercel AI SDK + Agents SDK + Postgres + warehouse replica.
- **Lightweight:** Mock warehouse + local Postgres; skip pgvector until glossary search matters.
- **Production-heavy:** Dedicated query workers + online evals + per-tenant cost budgets + semantic layer governance.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: auth workspace + SelectionState from client.
- LLM: analyst agent emitting narrative + optional validated chart patches.
- Tools: read-only warehouse via BFF; exports gated.
- Memory: optional embeddings over metric glossary.
- Output: host components apply accepted patches with audit rows.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static charts + Copilot reads canned annotations.

### Step 2: Add AI layer
- LLM explains only precomputed stats JSON.

### Step 3: Add tools
- Template SQL executor + metric catalog tool.

### Step 4: Add memory or context
- pgvector on glossary + saved lenses (RLS).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional LangGraph split: SQL agent vs copy agent.

---

## 📊 Evaluation
- Grounding: answers match golden SQL.
- Latency: hover→first token within budget.
- Safety: tenant isolation tests in CI.

---

## ⚠️ Challenges & Failure Cases
- Hallucinated metrics—template SQL + caps.
- Runaway spend—row limits + cancel.

---

## 🏭 Production Considerations
- RLS in warehouse views; per-seat rate limits; query audit.

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- AG-UI contracts for chart state.
- Grounded analytics vs chat-on-CSV.
