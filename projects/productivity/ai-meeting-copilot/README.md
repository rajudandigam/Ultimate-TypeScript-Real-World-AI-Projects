System Type: Agent  
Complexity: Level 3  
Industry: Productivity  
Capabilities: Summarization, Decision making, Memory  

# AI Meeting Copilot

## 🧠 Overview
An **in-product agent** (agentic UI) that listens to meeting streams or processed transcripts, maintains a live **decision log** and **action item ledger**, and surfaces **context-aware** controls in React—grounded in what the user is looking at in the host app, not a detached chat window.

---

## 🎯 Problem
Meetings produce outcomes that rarely land cleanly in systems of record: decisions are scattered across notes, chat threads, and memory. Generic meeting bots dump summaries nobody trusts because they lack **application context** and cannot tie statements to **trackable tasks**.

---

## 💡 Why This Matters
- **Pain it removes:** Re-work from ambiguous follow-ups, missing owners/dates, and “we decided something” without a durable artifact.
- **Who benefits:** Product, customer success, and engineering leads who already live in web apps and want **action capture** where work happens.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (agentic UI)

The interaction model is **tight coupling** between UI state (current account, ticket, doc section) and agent tool calls (create task, link CRM). That is best served by one agent with a **narrow tool contract** and strong client-side guardrails, not a multi-agent free-for-all in real time.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. **Memory** matters for meeting series continuity (recurring syncs) and for retrieving prior decisions linked to the same customer or epic.

---

## 🏭 Industry
Example:
- Productivity (meeting intelligence, work management, CRM-adjacent workflows)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (prior meeting notes, CRM snippets)
- Planning — light (agenda tracking)
- Reasoning — bounded (infer owners only when evidence exists)
- Automation — **in scope** (create tasks, schedule follow-ups)
- Decision making — **in scope** (explicit decision objects with confidence)
- Observability — **in scope**
- Personalization — per-user voice and terminology preferences
- Multimodal — optional (native meeting provider diarization)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (host app + CopilotKit-style side panel)
- **CopilotKit** or **Vercel AI SDK** (`useChat`, tool streaming)
- **WebRTC / vendor SDKs** (Zoom, Meet, Teams) where policy allows—often **post-meeting transcript** ingestion is the practical v1
- **OpenAI SDK** / **Realtime API** (only if latency and privacy posture fit)
- **Postgres** (decision log, action items, consent records)
- **OpenTelemetry** (client + server spans)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Streaming transcript segments + **UI context snapshot** (route, selected entity IDs, visible fields user consented to share).
- **LLM layer:** Agent proposes structured updates (decisions, actions) with citations to transcript offsets.
- **Tools / APIs:** Create Linear/Jira issues, update Notion, attach summary to CRM timeline—each tool validated server-side.
- **Memory (if any):** Per-series thread memory; retrieval of last N meetings for the same project.
- **Output:** Live UI chips (decisions/actions), post-meeting export packet, audit trail.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Ingest finalized transcript; template summary; manual copy—no tools.

### Step 2: Add AI layer
- Structured extraction of decisions/actions with transcript offsets only.

### Step 3: Add tools
- Server-mediated tools with OAuth; optimistic UI with rollback on 4xx.

### Step 4: Add memory or context
- Link meetings to CRM/account entities; retrieve prior decisions to detect contradictions.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional: separate **real-time chunk agent** vs **post-meeting reconcile agent** if you must isolate latency domains—still expose one UX surface.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Action item precision/recall vs human labels; decision attribution correctness.
- **Latency:** Time from utterance to stable UI suggestion; transcript lag budget.
- **Cost:** Tokens per minute of meeting; caching impact.
- **User satisfaction:** Edit distance on created tasks, weekly active teams, opt-in retention.
- **Failure rate:** Tool errors, hallucinated owners, consent violations blocked at server.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Tasks invented without speaker support; mitigated by offset citations and “needs confirmation” states.
- **Tool failures:** CRM down; mitigated by queue + user-visible retry.
- **Latency issues:** Streaming UI overload; mitigated by batching and debounced updates.
- **Cost spikes:** Long all-hands; mitigated by summarization windows and tiered features.
- **Incorrect decisions:** Auto-assigning sensitive work; mitigated by role checks, private mode, and human confirm for external writes.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log tool payloads with redaction; never store audio without consent flags.
- **Observability:** Client error rates, tool latency, model fallback usage.
- **Rate limiting:** Per tenant and per meeting; cap tool calls per minute.
- **Retry strategies:** Idempotent task creation keys; dedupe on transcript segment hashes.
- **Guardrails and validation:** Server-side JSON schema; allowlisted fields from UI context; PII minimization.
- **Security considerations:** Enterprise SSO, tenant isolation, retention policies, legal hold flows, clear data processing agreements.

---

## 🚀 Possible Extensions

- **Add UI:** Timeline scrubber aligned to transcript; reviewer queue for low-confidence items.
- **Convert to SaaS:** Multi-tenant meeting connectors and policy packs.
- **Add multi-agent collaboration:** Separate “compliance redactor” agent with no write tools.
- **Add real-time capabilities:** True live captions + incremental extraction with stricter budgets.
- **Integrate with external systems:** Calendar auto-scheduling, Slack digest with deep links.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start post-meeting for trust; add live features only with proven offline accuracy and privacy controls.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Agentic UI** patterns in React (context injection, safe tools)
  - **Structured meeting artifacts** beyond summaries
  - **Consent-aware** context bundling
  - **System design thinking** for real-time + async reconciliation
