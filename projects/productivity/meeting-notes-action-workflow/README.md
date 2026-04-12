System Type: Workflow  
Complexity: Level 2–3  
Industry: Productivity  
Capabilities: Extraction, Automation  

# Meeting Notes → Action Workflow

## 🧠 Overview
A **durable workflow** that ingests **meeting transcripts** (or vendor-generated notes), extracts **action items** with owners and due hints, optionally assigns them into **Notion or Jira**, and maintains an **audit trail** keyed by meeting id—without framing the product as an open-ended “AI chat about your meeting.”

---

## 🎯 Problem
Decisions and follow-ups leak when notes live in silos. Fully automated task creation without validation creates wrong assignees, wrong projects, and duplicate tickets. The missing piece is **workflow discipline**: idempotency, confidence routing, and integration contracts.

---

## 💡 Why This Matters
- **Pain it removes:** Manual copy from doc → tracker, lost accountability, and “I thought someone was doing that” gaps.
- **Who benefits:** Chiefs of staff, program managers, and CS teams who already produce transcripts and need **reliable capture** into systems of record.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** AI Workflow

This problem is fundamentally **pipeline-shaped**: ingest → normalize → extract → dedupe → write. LLM steps sit inside **named stages** with schemas and tests, not as an autonomous agent owning external writes without checks.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2 early (tool calls to trackers), moving to **Level 3** when you add **memory** for thread continuity and smarter dedupe against recent tasks.

---

## 🏭 Industry
Example:
- Productivity (meeting ops, delivery management, customer success)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (project glossary, prior meeting decisions)
- Planning — light (grouping actions by theme)
- Reasoning — bounded (infer owner only with evidence)
- Automation — **in scope**
- Decision making — bounded (route to board, hold for human)
- Observability — **in scope**
- Personalization — optional (per-team routing tables)
- Multimodal — optional (diarization metadata from provider)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** or **Inngest** / **BullMQ** (durable steps, retries)
- **OpenAI SDK** (structured extraction)
- **Notion API**, **Jira REST**
- **Postgres** (idempotency, audit, transcript references)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Transcript webhook, file upload, or calendar-linked ingestion; optional approval inbox.
- **LLM layer:** Structured extraction only for fields not resolved by rules (owner, due date, priority).
- **Tools / APIs:** Create/update tasks, search duplicates, resolve people via directory service.
- **Memory (if any):** Recent tasks index for dedupe; optional embeddings for semantic duplicate detection.
- **Output:** Task URLs + meeting summary artifact stored for audit.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template parser for known transcript formats; manual mapping table from section headers to boards.

### Step 2: Add AI layer
- LLM extracts `{title, owner_hint, due_hint, priority}` with JSON schema and confidence.

### Step 3: Add tools
- Wire Jira/Notion with idempotent creates keyed by `(meeting_id, action_fingerprint)`.

### Step 4: Add memory or context
- Pull prior meeting decisions for the same project id to merge follow-ups intelligently.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional bounded agent for “clarification questions” only if you add interactive UI; workflow still owns writes.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall of extracted actions vs human labels.
- **Latency:** Time from transcript ready to tasks created or queued.
- **Cost:** LLM calls per meeting minute after rule short-circuiting.
- **User satisfaction:** Edit rate on created tasks, reduction in duplicate tickets.
- **Failure rate:** Tool 4xx, schema failures, wrong-project creations.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented deadlines or owners; mitigated by directory lookup tool and confidence gating.
- **Tool failures:** API rate limits; mitigated by backoff and DLQ with replay.
- **Latency issues:** Very long transcripts; mitigated by chunking with preserved speaker/timestamps for citations.
- **Cost spikes:** Reprocessing entire history; mitigated by incremental ingestion keyed by `event_id`.
- **Incorrect decisions:** Sensitive content in ticket bodies; mitigated by redaction rules and human queue for low confidence.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log meeting ids and action fingerprints; minimize PII in logs per policy.
- **Observability:** Queue depth, DLQ rate, extraction confidence histogram, connector error taxonomy.
- **Rate limiting:** Per tenant and per destination API.
- **Retry strategies:** Idempotent writes; poison message handling with operator alerts.
- **Guardrails and validation:** Allowlisted workspaces/projects; max actions per meeting; DLP scan before outbound text.
- **Security considerations:** OAuth token vaulting, consent for recording/transcription, regional data residency.

---

## 🚀 Possible Extensions

- **Add UI:** Triage inbox with inline transcript citations.
- **Convert to SaaS:** Multi-tenant routing and connector marketplace.
- **Add multi-agent collaboration:** Rare; prefer explicit workflow branches.
- **Add real-time capabilities:** Incremental processing as transcript streams (with stricter partial-state rules).
- **Integrate with external systems:** Slack huddle exports, CRM timeline linking.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep writes workflow-owned; add intelligence where classification is fuzzy.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Durable workflows** for async human-generated content
  - **Structured extraction** as the contract with downstream systems
  - **Idempotency** across messy real-world transcripts
  - **System design thinking** for trust and auditability
