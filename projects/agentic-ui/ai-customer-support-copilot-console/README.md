System Type: Agentic UI
Complexity: L3
Industry: Support / CRM (AG-UI)
Capabilities: Retrieval, Suggestions, UI interaction, Streaming

# AI Customer Support Copilot Console

## 🧠 Overview
A **support console** where agents work tickets with a CopilotKit surface that drafts replies, pulls KB articles, and shows confidence—always editable before send.

---

## 🎯 Problem
Plain CRM + separate chat leads to stale macros, untracked AI text, and weak grounding in ticket + customer history.

---

## 💡 Why This Matters
- Cuts handle time while keeping humans accountable.
- Pairs retrieval with the exact ticket context on screen—not a detached bot.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L3

---

## 🏭 Industry
Support / CRM (AG-UI)

---

## 🧩 Capabilities
Retrieval, Suggestions, UI interaction, Streaming

---

## AG-UI Interaction Model
User: triages queues, selects snippets, edits drafts.
AI: suggestion rail + inline completions with confidence badges and citations to KB chunks.
Decisions: propose macros with evidence; high-risk intents require explicit click-to-apply.
Overrides: full manual edit always wins; diff view for AI insertions.
Trust: show article IDs, retrieval scores, and policy flags (refund eligibility, PII).

---

## 🛠️ Suggested TypeScript Stack
Examples:

- CopilotKit + Vercel AI SDK in Next.js console.
- OpenAI Agents SDK tools: ticket fetch, KB search, order lookup (read-only by default).
- Postgres for drafts/audit; pgvector for KB; Redis for session.
- Zendesk / Salesforce / Intercom REST via BFF.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Customer Support Copilot Console** (Agentic UI, L3) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Zendesk / Salesforce Service Cloud / Intercom APIs
- Internal KB HTTP
- Slack threads for escalation

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- LangChain.js optional for complex retrievers

### Stack Choice Guide
- **Best default:** Next console + CopilotKit + Agents SDK + Postgres/pgvector + CRM APIs via BFF.
- **Lightweight:** Mock CRM/KB; single Postgres.
- **Production-heavy:** Dual approval flows, eval harness on tone+grounding, multi-region BFF.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: ticket id + visible fields + agent selection.
- LLM: grounded reply composer with structured Draft objects.
- Tools: CRM + KB + order search with RBAC.
- Output: editable draft buffer; send only via host button.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Render tickets; static macros.

### Step 2: Add AI layer
- Suggest replies from templates only.

### Step 3: Add tools
- KB + CRM read tools with ACL.

### Step 4: Add memory or context
- Embeddings over KB + past approved replies (redacted).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional supervisor for tone vs facts (LangGraph).

---

## 📊 Evaluation
- Human accept rate of drafts
- KB citation precision
- Time-to-first-suggestion

---

## ⚠️ Challenges & Failure Cases
- Leaky PII in prompts—redact pipeline
- Bad citations—threshold + fallback

---

## 🏭 Production Considerations
- Per-agent rate limits
- Audit every send
- SOC2-friendly logging

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- AG-UI for high-stakes text
- Confidence UX patterns
