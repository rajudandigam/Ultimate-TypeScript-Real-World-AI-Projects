System Type: Agentic UI
Complexity: L4
Industry: Travel (AG-UI workspace)
Capabilities: Planning, Personalization, UI interaction, Streaming

# AI Travel Planning Workspace (Interactive Builder)

## 🧠 Overview
A **visual itinerary board** where travelers drag stops, adjust days, and a CopilotKit agent proposes improvements, explains tradeoffs, and syncs changes live—distinct from backend multi-agent supplier orchestration.

---

## 🎯 Problem
Chat-only trip bots lose spatial/temporal structure; users cannot co-edit an itinerary like a real planning surface.

---

## 💡 Why This Matters
- Pairs human spatial reasoning with grounded suggestions.
- Shows AG-UI for collaborative planning without replacing supplier integrations.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
Travel (AG-UI workspace)

---

## 🧩 Capabilities
Planning, Personalization, UI interaction, Streaming

---

## AG-UI Interaction Model
User: drag blocks, set pace, pin must-see anchors.
AI: contextual rail suggesting reorder, day-budget warnings, weather overlays.
Decisions: preview patches to the itinerary graph; accept applies versioned diff.
Overrides: manual drag always wins; AI cannot book without explicit tool + consent.
Trust: show freshness for prices when tools are wired; label simulated data in MVP.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- React flow/canvas + CopilotKit co-editing.
- Vercel AI SDK streaming for suggestions.
- Agents SDK tools: maps routing, optional supplier adapters.
- Postgres for itinerary graph versions; Redis for presence.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Travel Planning Workspace (Interactive Builder)** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Google Routes/Places or Mapbox
- Optional Duffel/Amadeus when licensed
- Weather APIs

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- React Flow / custom canvas libraries
- LangGraph optional for supplier subgraph

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres itinerary store + maps tools.
- **Lightweight:** Mock maps + local graph only.
- **Production-heavy:** Pair with dedicated orchestration service + OTel across UI and agents.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: itinerary graph JSON + user prefs.
- LLM: planning copilot emitting graph ops (Zod).
- Tools: maps + optional flight/hotel search adapters.
- Output: host validates DAG constraints before commit.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Local-only itinerary board.

### Step 2: Add AI layer
- Suggest text summaries of static plans.

### Step 3: Add tools
- Maps distances first; stub suppliers.

### Step 4: Add memory or context
- Save versions per user trip.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Delegate supplier calls to separate service if paired with travel planner agent system.

---

## 📊 Evaluation
- Constraint violations per edit
- User satisfaction on reorder suggestions
- Latency of drag→suggestion

---

## ⚠️ Challenges & Failure Cases
- Invalid graph cycles—server validation
- Hallucinated POI hours—require tool payload

---

## 🏭 Production Considerations
- Versioning + audit of AI edits
- Rate limits on map calls

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Co-editing AG-UI
- Graph ops as agent outputs
