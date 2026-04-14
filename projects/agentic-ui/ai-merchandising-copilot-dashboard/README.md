System Type: Agentic UI
Complexity: L4
Industry: E-commerce (AG-UI)
Capabilities: Optimization, Insights, UI interaction, Streaming

# AI E-commerce Merchandising Copilot Dashboard

## 🧠 Overview
Merchants drag products on a **virtual shelf**, tune pricing sliders, and a CopilotKit agent forecasts margin impact, highlights trends, and proposes bundles—grounded in catalog + sales feeds.

---

## 🎯 Problem
Merch teams bounce between BI tools and spreadsheets; passive dashboards cannot react to drags and drops in the planning canvas.

---

## 💡 Why This Matters
- Speeds seasonal layout + pricing experiments.
- Shows AG-UI for operations-heavy commerce surfaces.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
E-commerce (AG-UI)

---

## 🧩 Capabilities
Optimization, Insights, UI interaction, Streaming

---

## AG-UI Interaction Model
User: drags SKUs, sets promos, adjusts price bands.
AI: overlays demand elasticity hints (when data exists) and proposes bundles with expected AOV lift.
Decisions: preview cards with confidence + historical window used.
Overrides: merchant rejects bundle; AI learns constraint for session.
Trust: show data windows, outliers removed, and simulation assumptions.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Next + CopilotKit + canvas/shelf UI.
- Agents SDK tools: fetch sales series, inventory, recommend placement heuristics.
- Shopify/Commerce APIs in BFF.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI E-commerce Merchandising Copilot Dashboard** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Shopify Admin API / custom OMS
- Stripe if checkout experiments
- Ads/marketing optional

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- Recharts/visx
- Zod for ShelfPatch

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres + commerce APIs.
- **Lightweight:** CSV sales + mocked catalog.
- **Production-heavy:** Streaming sales ingest + experiment framework + evals on revenue guardrails.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: catalog slice + drag-drop state.
- LLM: merchandising copilot emitting ShelfPatch JSON.
- Tools: sales aggregates + inventory checks.
- Output: validated UI mutations + audit.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static shelf from catalog.

### Step 2: Add AI layer
- Text tips per SKU without tools.

### Step 3: Add tools
- Sales + inventory reads.

### Step 4: Add memory or context
- Store successful layouts as templates.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional pricing risk agent.

---

## 📊 Evaluation
- Simulation error vs holdout
- Merchant acceptance rate
- Latency drag→insight

---

## ⚠️ Challenges & Failure Cases
- Stale inventory—surface recency
- Overconfident elasticity—show ranges

---

## 🏭 Production Considerations
- Role-based publish gates
- Audit pricing suggestions

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Operations AG-UI
- Grounded retail analytics
