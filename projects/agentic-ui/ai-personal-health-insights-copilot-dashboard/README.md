System Type: Agentic UI
Complexity: L4
Industry: Health / Wellness (AG-UI)
Capabilities: Analysis, Personalization, UI interaction, Streaming

# AI Personal Health Insights Dashboard (Personalized)

## 🧠 Overview
A **consumer wellness** dashboard (non-clinical by default) where wearable and habit data meet CopilotKit: users explore charts, and the agent explains patterns, suggests habits, and flags when to seek professionals.

---

## 🎯 Problem
Wellness apps either spam notifications or hide reasoning; users lack interactive, explainable coaching tied to their charts.

---

## 💡 Why This Matters
- Demonstrates compassionate AG-UI without replacing clinicians.
- Great pattern for consent-heavy personal metrics.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
Health / Wellness (AG-UI)

---

## 🧩 Capabilities
Analysis, Personalization, UI interaction, Streaming

---

## AG-UI Interaction Model
User: selects metrics, toggles goals, marks symptoms (non-diagnostic).
AI: contextual insights with ranges + lifestyle suggestions; escalates disclaimers.
Decisions: never auto-changes medical settings; proposals are cards.
Overrides: user dismisses insight; feedback stored locally/session.
Trust: confidence + cohort comparisons where ethical; clear non-diagnostic copy.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Next + CopilotKit + chart interactions.
- Apple HealthKit / Google Fit APIs via on-device or BFF bridges (platform dependent).
- Postgres for aggregates; encrypt sensitive fields.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Personal Health Insights Dashboard (Personalized)** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- HealthKit / Google Fit (as permitted)
- Optional FHIR sandboxes only if you expand to clinical pilots

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- Zod for metric windows
- Temporal for nightly aggregation jobs

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres + wearable integrations via BFF.
- **Lightweight:** CSV-only metrics.
- **Production-heavy:** HIPAA/BAA path as separate deployment mode with hardened controls.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: aggregated metrics + user goals.
- LLM: wellness coach with strict policy prompts + tool use for summaries.
- Tools: statistical helpers over stored aggregates.
- Output: insight cards with citations to user data windows.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static charts from CSV export.

### Step 2: Add AI layer
- Template insights.

### Step 3: Add tools
- Integrate one wearable provider sandbox.

### Step 4: Add memory or context
- Store user goals + dismissed insights.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional escalation triage agent for care navigation (policy-bound).

---

## 📊 Evaluation
- User-reported helpfulness
- Safety: refusal tests on diagnostic asks
- Latency

---

## ⚠️ Challenges & Failure Cases
- Diagnostic drift—hard refusal templates
- Data gaps—explicit uncertainty

---

## 🏭 Production Considerations
- Consent management
- Encryption
- Regional compliance toggles

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Consent-first AG-UI
- Explainable wellness UX
