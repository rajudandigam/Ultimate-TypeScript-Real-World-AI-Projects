System Type: Agentic UI
Complexity: L4
Industry: Fintech (AG-UI)
Capabilities: Personalization, Prediction, UI interaction, Streaming

# AI Financial Planning Copilot Dashboard (Interactive)

## 🧠 Overview
An interactive **household finance** workspace where sliders and goals co-drive a CopilotKit agent that recomputes scenarios, surfaces risks, and narrates tradeoffs with transparent assumptions.

---

## 🎯 Problem
Static spreadsheets and chat-only bots either lack interactivity or lack grounding in the user's real cashflow categories.

---

## 💡 Why This Matters
- Helps users stress-test plans without exporting sensitive data.
- Demonstrates AG-UI for regulated-adjacent consumer finance UX.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
Fintech (AG-UI)

---

## 🧩 Capabilities
Personalization, Prediction, UI interaction, Streaming

---

## AG-UI Interaction Model
User: moves sliders for savings rate, rent, debt payoff; toggles goals.
AI: live scenario cards + warnings; proposes adjustments with visible formulas.
Decisions: show confidence bands from Monte Carlo-lite sims run server-side.
Overrides: user pins constraints AI cannot relax without confirmation.
Trust: show assumptions, data sources, and 'not advice' disclaimers where required.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Next + Tailwind charts + CopilotKit for co-scenarios.
- Agents SDK tools: recompute ledger, fetch transactions (aggregated), run stress sim.
- Plaid (sandbox) or CSV import adapters.
- Postgres for user ledger; Redis for fast what-if cache.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Financial Planning Copilot Dashboard (Interactive)** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Plaid (transactions/balances where permitted)
- Stripe Billing if subscriptions matter
- Open banking APIs region-specific

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- Zod scenario schemas
- Temporal optional for scheduled recompute jobs

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres + Plaid sandbox + deterministic sim service.
- **Lightweight:** CSV-only import + mocked Plaid.
- **Production-heavy:** Dedicated analytics workers + compliance review queues + eval harness for advice tone.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: aggregated category totals (minimize raw txn exposure).
- LLM: planning copilot emitting ScenarioCard JSON.
- Tools: deterministic finance kernels + aggregation queries.
- Output: UI applies cards after validation; PDF export optional.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual sliders + local calc without AI.

### Step 2: Add AI layer
- Narrate fixed scenarios.

### Step 3: Add tools
- Plaid/CSV ingest with consent flows.

### Step 4: Add memory or context
- Store goals + baseline snapshots.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional risk agent for compliance copy.

---

## 📊 Evaluation
- Scenario parity vs spreadsheet goldens
- Latency of slider→recompute
- User trust scores

---

## ⚠️ Challenges & Failure Cases
- Overfitting sparse data—show ranges
- Model gives tax/legal advice—block with policy

---

## 🏭 Production Considerations
- Consent logs
- Data minimization
- Encryption at rest

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- AG-UI for simulations
- Grounded personal finance UX
