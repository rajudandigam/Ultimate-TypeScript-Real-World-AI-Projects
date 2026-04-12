System Type: Workflow  
Complexity: Level 3  
Industry: Legal / Compliance  
Capabilities: Monitoring  

# Regulatory Change Impact Analyzer

## 🧠 Overview
**Ingestion workflows** monitor **regulatory feeds** (RSS, official APIs, paid trackers), **normalize** updates into **change records**, **diff** against your **internal control library** (policies, product features, data maps), and route **impact assessments** to owners—LLM assists **mapping suggestions** only with **citations** to source text and **human sign-off** before any control change is recorded as approved.

---

## 🎯 Problem
Compliance teams learn about rule changes late; manual scanning does not scale across **jurisdictions** and **product surfaces**.

---

## 💡 Why This Matters
- **Pain it removes:** Missed filing deadlines, rushed product changes, and audit findings from stale control registers.
- **Who benefits:** Legal, GRC, and product policy leads in regulated software and fintech.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Scheduled fetch, dedupe, ticketing, and SLA escalations are durable workflows; optional agent assists triage queues.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Feed ingestion + semantic match to internal corpus + review workflow; L5 adds enterprise-wide control graph automation with formal signatories and evidence chains.

---

## 🏭 Industry
Example:
- Legal / compliance / GRC

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — internal policies, control library, past assessments
- Planning — bounded (impact rollout plan drafts)
- Reasoning — bounded (mapping proposals with citations)
- Automation — ticket routing, reminders
- Decision making — bounded (severity tier suggestion)
- Observability — **in scope**
- Personalization — per-jurisdiction watchlists
- Multimodal — PDF/HTML sources from regulators

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** workers
- **Temporal** / **Inngest** for schedules
- **Postgres** + **pgvector** for semantic match to controls
- **OpenAI SDK** optional for structured “impact draft”
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Source registry, subscription tiers, owner matrix.
- **LLM layer:** Proposes affected controls with `citation[]` to source clauses.
- **Tools / APIs:** Feed fetchers, document parsers, ticketing (Jira/ServiceNow).
- **Memory (if any):** Versioned control register; assessment history.
- **Output:** Impact tickets, executive summaries, audit export packages.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual paste of regulation text + keyword match to control IDs.

### Step 2: Add AI layer
- LLM labels section topics for humans only.

### Step 3: Add tools
- Automated feeds + dedupe by content hash and official id.

### Step 4: Add memory or context
- Embeddings over internal policies; track mapping confidence scores.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist agents per domain (privacy vs financial promos) with merge review.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human acceptance rate of proposed mappings on labeled updates.
- **Latency:** Time from publication to first triaged ticket.
- **Cost:** Feed licenses + compute + LLM per change record.
- **User satisfaction:** GRC team trust; fewer missed deadlines in audits.
- **Failure rate:** False matches, missed jurisdictional scope, hallucinated citations.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented clauses; require source URLs + quoted spans validated by fetch checksum.
- **Tool failures:** Feed downtime; explicit staleness banners, not silent “no impact.”
- **Latency issues:** Large PDFs; chunked OCR/index pipeline async from interactive triage.
- **Cost spikes:** Re-embedding entire corpus per update; incremental index updates only.
- **Incorrect decisions:** Auto-closing tickets as “no impact” without human review for high-severity sources.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable evidence attachments; legal hold support.
- **Observability:** Ingest lag, parse failures, SLA to owner ack, override reasons.
- **Rate limiting:** Respect publisher robots/terms; backoff on 429.
- **Retry strategies:** Idempotent upserts of `change_record_id`.
- **Guardrails and validation:** Jurisdiction scoping; separation of duties on approvals; export redaction for third parties.
- **Security considerations:** Access control for unreleased product maps, encryption, vendor DPAs for licensed feeds.

---

## 🚀 Possible Extensions

- **Add UI:** Diff viewer for regulation text vs prior version with control overlays.
- **Convert to SaaS:** Multi-tenant regulatory radar.
- **Add multi-agent collaboration:** Regional counsel agent with locale-specific prompts (still human-approved).
- **Add real-time capabilities:** Push alerts for emergency bulletins.
- **Integrate with external systems:** OneTrust, Archer, Workiva, Vanta for control sync.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **citation integrity** and **human approval** before widening automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Regulatory change** operations
  - **Control libraries** as living data
  - **Evidence-first** AI in legal contexts
  - **System design thinking** for GRC engineering
