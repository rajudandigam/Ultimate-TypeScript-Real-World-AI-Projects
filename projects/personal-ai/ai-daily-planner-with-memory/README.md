System Type: Workflow → Agent  
Complexity: Level 4  
Industry: Personal AI  
Capabilities: Planning, Memory  

# AI Daily Planner with Memory

## 🧠 Overview
A system where **durable workflows** build a daily schedule from calendars, tasks, and fixed constraints, while a **planning agent** handles **ambiguous prioritization** and **natural-language edits**—persisting **memory** of patterns (energy windows, focus preferences) with explicit user controls and export/delete.

---

## 🎯 Problem
Calendars show meetings but not **intent**: deep work blocks, commute buffers, and personal commitments scattered across apps. LLM-only planners hallucinate tasks. You need **structured scheduling** plus **agent assist** for reordering under constraints.

---

## 💡 Why This Matters
- **Pain it removes:** Constant manual reshuffling, missed buffers, and planning anxiety for knowledge workers.
- **Who benefits:** Individuals and small teams wanting a local-first or privacy-conscious planner upgrade.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow → Agent

**Workflows** handle sync, conflict detection, notifications, and repeatable daily compile jobs. The **agent** helps interpret user instructions (“move deep work to mornings”) as **validated schedule patches**.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Combines **memory**, **calendar constraints**, and **interactive editing** with strong validation; L5 adds enterprise controls and HA hardening.

---

## 🏭 Industry
Example:
- Personal AI (time management, scheduling intelligence)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (retrieve past planner notes)
- Planning — **in scope**
- Reasoning — bounded (explain tradeoffs)
- Automation — **in scope** (time blocking, reminders)
- Decision making — bounded (priority suggestions)
- Observability — **in scope**
- Personalization — **in scope**
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (calendar UI)
- **Temporal** / **Inngest** (daily compile, retries)
- **Node.js + TypeScript**
- **Microsoft Graph / Google Calendar** APIs
- **Postgres** (plans, memory, audit)
- **OpenAI SDK**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Calendar OAuth, task imports, NL commands, “pin” constraints.
- **LLM layer:** Agent proposes `SchedulePatch` operations against a canonical interval graph.
- **Tools / APIs:** Read calendars, read tasks, write blocks (confirm-gated), fetch travel time estimates.
- **Memory (if any):** Learned preferences and recurring explanations; encrypted at rest.
- **Output:** Day plan artifact + diffs + ICS export optional.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic day compile from calendar free blocks + fixed rules.

### Step 2: Add AI layer
- LLM labels blocks with intents using only structured calendar facts.

### Step 3: Add tools
- Add travel time and task duration estimation tools.

### Step 4: Add memory or context
- Store user preference vectors updated from accepted edits only.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional separate “focus coach” agent with read-mostly tools—merge via supervisor if needed.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Constraint violations (double-book) near zero; user acceptance of auto blocks vs edits.
- **Latency:** Daily compile time; interactive patch latency.
- **Cost:** Tokens per user per day under typical churn.
- **User satisfaction:** Reduced rescheduling time, qualitative ease scores.
- **Failure rate:** Invalid patches, OAuth token failures, wrong timezone bugs.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented meetings; mitigated by tool-backed calendar reads only.
- **Tool failures:** API partial sync; mitigated by staleness markers and manual refresh paths.
- **Latency issues:** Large calendars; mitigated by incremental diff sync and windowed compilation.
- **Cost spikes:** Re-LLM entire month hourly; mitigated by hashing inputs and debouncing NL edits.
- **Incorrect decisions:** Overwriting user pins; mitigated by immutable constraint tags server-side.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log patch versions; minimize sensitive event titles in logs if configured.
- **Observability:** Sync failure rates, compile durations, patch rejection reasons.
- **Rate limiting:** Per user NL command rate; connector quotas.
- **Retry strategies:** Idempotent calendar writes; safe replays for compile jobs.
- **Guardrails and validation:** Graph validation for overlaps; max auto-moves per day.
- **Security considerations:** OAuth hardening; encryption; export/delete; optional local-first sync.

---

## 🚀 Possible Extensions

- **Add UI:** Drag blocks with “explain why” tooltips from memory features.
- **Convert to SaaS:** Team shared calendars with role-based patch permissions.
- **Add multi-agent collaboration:** Optional meeting negotiation agent (careful scope).
- **Add real-time capabilities:** Live updates as meetings shift.
- **Integrate with external systems:** Slack status, focus modes, commute APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep compilation deterministic; let the agent propose patches, not own truth.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Schedule graphs** and patch semantics
  - **Workflow-driven** daily compilation
  - **Memory** that learns only from explicit user acceptance
  - **System design thinking** for calendar-grade reliability
