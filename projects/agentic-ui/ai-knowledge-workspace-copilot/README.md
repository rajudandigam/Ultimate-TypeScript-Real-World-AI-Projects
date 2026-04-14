System Type: Agentic UI
Complexity: L4
Industry: Productivity / Knowledge (AG-UI)
Capabilities: Retrieval, Memory, UI interaction, Streaming

# AI Knowledge Workspace (Notion-style with Agent)

## 🧠 Overview
A **doc workspace** with blocks, backlinks, and a CopilotKit agent that summarizes, proposes new sections, and surfaces a knowledge graph view—without turning the editor into a passive chat window.

---

## 🎯 Problem
Separate chat tools lose block-level context; users cannot apply AI suggestions as structured edits.

---

## 💡 Why This Matters
- Keeps knowledge work inside the editor with diffs.
- Great AG-UI reference for block editors + retrieval.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L4

---

## 🏭 Industry
Productivity / Knowledge (AG-UI)

---

## 🧩 Capabilities
Retrieval, Memory, UI interaction, Streaming

---

## AG-UI Interaction Model
User: selects blocks, toggles graph lens, accepts inline suggestions.
AI: sidebar + inline ghost text for new sections; proposes links between pages with preview.
Decisions: patch objects insert as tracked suggestions, not silent writes.
Overrides: reject per hunk; revert stack like git.
Trust: show retrieval sources and similarity scores for auto-links.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Block editor (TipTap/Slate) + CopilotKit.
- pgvector for embeddings; Postgres for graph edges.
- Agents SDK tools: search pages, insert block patch, fetch backlinks.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Knowledge Workspace (Notion-style with Agent)** (Agentic UI, L4) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Optional Google Drive/Notion import connectors
- OIDC for workspace auth

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- TipTap or Slate
- LangChain.js optional for hybrid retrievers

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres/pgvector + block editor.
- **Lightweight:** Single-user local workspace.
- **Production-heavy:** Realtime collaboration + CRDT + OTel + eval harness for patch safety.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: page_id + block selection + schema version.
- LLM: editor copilot emitting BlockPatch[] validated server-side.
- Tools: search + link graph queries.
- Output: UI diff preview then commit.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Markdown editor + manual save.

### Step 2: Add AI layer
- Summarize selection only.

### Step 3: Add tools
- Search workspace pages.

### Step 4: Add memory or context
- Embeddings per page chunk with ACL.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional sub-agent for graph layout suggestions.

---

## 📊 Evaluation
- Patch validity rate
- Retrieval precision@k
- Edit acceptance

---

## ⚠️ Challenges & Failure Cases
- Conflicting edits—OT/locking
- Hallucinated links—threshold

---

## 🏭 Production Considerations
- Version history
- Share permissions
- Export controls

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Block-level AG-UI
- Graph + editor integration
