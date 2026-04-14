System Type: Agentic UI
Complexity: L3
Industry: Education (AG-UI)
Capabilities: Tutoring, Adaptation, UI interaction, Streaming

# AI Learning Copilot (Interactive Study UI)

## 🧠 Overview
An **interactive study surface** where learners select text, run quick quizzes generated in-place, and CopilotKit keeps difficulty adaptive—distinct from a passive tutoring chat.

---

## 🎯 Problem
Chat tutors ignore page structure; students cannot anchor questions to specific lesson blocks or get immediate inline checks.

---

## 💡 Why This Matters
- Improves retention with micro-interactions.
- Shows AG-UI for structured pedagogy.

---

## 🏗️ System Type
**Chosen:** **Agentic UI (AG-UI)** — the UI is not a passive host for chat; it **co-drives** the workflow with the agent via shared, typed state (selections, live streams, sliders) and **CopilotKit** as the integration spine.

---

## ⚙️ Complexity Level
**Target:** L3

---

## 🏭 Industry
Education (AG-UI)

---

## 🧩 Capabilities
Tutoring, Adaptation, UI interaction, Streaming

---

## AG-UI Interaction Model
User: highlights passage, requests quiz, marks confidence per item.
AI: inline questions + explanations tied to selection spans; adjusts next item difficulty.
Decisions: show rationale after attempt; learner can challenge with follow-up.
Overrides: skip topic; teacher locks curriculum sections.
Trust: cite lesson source ids; show coverage map of syllabus.

---

## 🛠️ Suggested TypeScript Stack
Examples:

- Next + CopilotKit + lesson renderer (MDX/blocks).
- Agents SDK tools: fetch lesson chunk, generate items with schema, log mastery.
- Postgres for mastery model.

---

<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Learning Copilot (Interactive Study UI)** (Agentic UI, L3) — **CopilotKit-first** AG-UI: UI state and agent turns stay synchronized; Vercel AI SDK for streaming; OpenAI Agents SDK for tools.

- **Next.js + React + TypeScript + Tailwind** — primary app shell.
- **CopilotKit** — shared UI↔agent runtime (primary AG-UI layer).
- **Vercel AI SDK** — streaming + structured parts for side panel and inline chips.
- **OpenAI Agents SDK** — tool calls with Zod schemas; LangChain.js only if you need extra adapters.
- **Hono or Fastify** — BFF + WebSockets/SSE for live streams (logs, collaboration).
- **Postgres + pgvector + Redis** — durable session, embeddings when retrieval matters, cache/rate limits.
- **Zustand + TanStack Query** — selection-driven client state + server cache discipline.
- **OpenTelemetry** — correlate UI gestures with model/tool spans.

### Suggested APIs and Integrations
- LMS APIs if embedded (Canvas/Google Classroom) optional
- OIDC for schools

### Open Source Building Blocks
- **CopilotKit**, **Vercel AI SDK**, **OpenAI Agents SDK**, **Zod**, **Vitest**, **Playwright**
- MDX content pipelines
- LangChain.js optional for RAG over course packs

### Stack Choice Guide
- **Best default:** Next + CopilotKit + Agents SDK + Postgres mastery store.
- **Lightweight:** Single course JSON + mocked LMS.
- **Production-heavy:** Multi-tenant schools + eval harness for question quality + moderation queue.

### Buildability Notes
- **Weekend-first:** one core screen + CopilotKit + one read tool + mocked upstream APIs; prove selection→grounded answer.
- **Defer:** fleet-wide SSO hardening, multi-region, advanced online eval grids until the interaction loop is trusted.
- **Essential:** schema validation on every AI-proposed UI mutation, audit trail, explicit user override paths.


## 🧱 High-Level Architecture
- Input: course_id + selection span ids.
- LLM: tutor agent emitting QuestionItem[] validated.
- Tools: lesson repository + analytics.
- Output: inline UI components from structured items.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static lessons + manual quiz.

### Step 2: Add AI layer
- One-off questions from selection.

### Step 3: Add tools
- Lesson chunk fetch.

### Step 4: Add memory or context
- Track mastery per skill tag.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional coach vs assessor split via LangGraph.

---

## 📊 Evaluation
- Item validity vs teacher rubric
- Learning gains on holdout sets
- Engagement time

---

## ⚠️ Challenges & Failure Cases
- Off-syllabus content—validator
- Too-hard cascades—bandit policy

---

## 🏭 Production Considerations
- FERPA-aware logging
- Teacher dashboards
- Content moderation

---

## 🚀 Possible Extensions
- Optional LangGraph subgraphs (e.g., separate analyst vs writer) behind one CopilotKit session.
- Deeper enterprise SSO, SCIM, and per-tenant model routing.

---

## 🔁 Evolution Path
Static UI → event-aware dashboard → CopilotKit + grounded tools → audited AG-UI with evals and cost guardrails.

---

## 🎓 What You Learn
- Pedagogical AG-UI
- Structured assessment generation
