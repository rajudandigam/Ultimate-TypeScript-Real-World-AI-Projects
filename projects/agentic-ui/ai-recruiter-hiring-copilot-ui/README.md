System Type: Agentic UI
Complexity: L3
Industry: HR (AG-UI)
Capabilities: Matching, Reasoning, UI interaction, Streaming

# AI Hiring Decision Copilot (Recruiter UI)

## 🧠 Overview
A **recruiter console** with side-by-side candidates, AI annotations, interview kits, and bias warnings—distinct from a generic hiring chatbot.

---

## 🎯 Problem
Recruiters juggle ATS tabs and unstructured notes; generic ranking lists lack transparent evidence tied to resumes and reqs.

---

## 💡 Why This Matters
- Improves structured decisions while keeping humans accountable.
- Demonstrates AG-UI for sensitive HR workflows.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L3

---

## 🏭 Industry
HR (AG-UI)

---

## 🧩 Capabilities
Matching, Reasoning, UI interaction, Streaming

---

## AG-UI Interaction Model
User: selects two candidates, highlights skills on resume PDFs.
AI: side panel with scored dimensions + citations to resume lines + risk flags.
Decisions: suggested interview questions reference req IDs; cannot auto-reject.
Overrides: recruiter edits scorecard; dismiss AI note with reason.
Trust: show detector outputs as advisory; log overrides for compliance.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Next + CopilotKit for dual-pane compare.
- Agents SDK tools: ATS fetch, resume parse, policy KB.
- Postgres for scorecards; object storage for PDFs.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Hiring Decision Copilot (Recruiter UI)** (Agentic UI, L3) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- Greenhouse / Lever / Workable APIs (pick one)
- Doc AI/OCR for resumes
- eSignature only if offers in-scope

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- LangChain.js optional for multi-doc packs

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres + ATS integration.
- **Lightweight:** CSV candidates + mocked ATS.
- **Production-heavy:** Dual-control approvals + evals on fairness metrics + enterprise SSO.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: job_id + candidate_ids + visible resume snippets.
- LLM: structured comparative analysis with citations.
- Tools: ATS + parser; bias heuristics as separate deterministic checks when possible.
- Output: UI renders annotations; no auto-stage changes.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- ATS list + manual notes.

### Step 2: Add AI layer
- Summaries per candidate.

### Step 3: Add tools
- Resume text extraction with ACL.

### Step 4: Add memory or context
- Store recruiter preferences per role.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional policy agent for compliance copy.

---

## 📊 Evaluation
- Citation precision
- Bias flag precision vs human review
- Time-to-interview-kit

---

## ⚠️ Challenges & Failure Cases
- Unsupported claims—require spans
- PII leakage—redact contacts

---

## 🏭 Production Considerations
- Legal retention windows
- Access logs
- Regional privacy toggles

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Evidence-first AG-UI
- Responsible hiring UX
