System Type: Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Retrieval  

# Candidate Sourcing Agent

## 🧠 Overview
Assists recruiters to **discover candidates** by querying **allowlisted** sources (internal CRM, alumni DB, conference lists, **licensed** talent platforms) with **structured search plans**—**no** scraping gated social sites against ToS; outputs are **shortlists with evidence links** and **outreach drafts** requiring **human send**.

---

## 🎯 Problem
Sourcing is manual and inconsistent; copy-paste outreach burns domain reputation and violates platform rules.

---

## 💡 Why This Matters
- **Pain it removes:** Empty pipelines for niche roles, duplicate outreach, and missed warm leads already in CRM.
- **Who benefits:** Technical recruiters and sourcers in competitive hiring markets.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `search_internal_talent_pool`, `search_ats_tags`, `similar_profiles` (embedding), `draft_outreach` (draft-only).

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-source retrieval + compliance + personalization; L4+ adds multi-agent (research vs writer) with strict boundaries.

---

## 🏭 Industry
HR / recruiting

---

## 🧩 Capabilities
Retrieval, Planning, Reasoning, Automation (draft), Observability, Personalization

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK tools, ATS APIs, Postgres/pgvector, LinkedIn-compliant partner APIs only, OpenTelemetry

---

## 🧱 High-Level Architecture
BFF + sourcing agent + connector adapters (internal-first) + audit log + human approval UI for messages.

---

## 🔄 Implementation Steps
(1) Internal-only search MVP (2) LLM summarizes matches (3) Add licensed external APIs (4) Embeddings for similarity (5) Optional multi-agent reviewer for tone/compliance

---

## 📊 Evaluation
Precision of shortlist vs recruiter labels, time-to-shortlist, outreach reply rate, compliance incident count (target 0), cost per search session

---

## ⚠️ Challenges & Failure Cases
Hallucinated employers; ToS-violating automation; PII leakage; biased filters; duplicate contacts spamming; rate limits causing partial results—mitigate with allowlists, human-in-loop send, redaction, dedupe keys, explicit data windows

---

## 🏭 Production Considerations
Audit trails, OAuth scopes, regional labor marketing laws, CAN-SPAM, DSAR deletion, rate limits, anomaly detection on bulk export

---

## 🚀 Possible Extensions
CRM sync, diversity analytics (aggregated), scheduling handoffs to coordinators

---

## 🔁 Evolution Path
Keyword search → enriched profiles → tool-using agent → multi-agent with governance

---

## 🎓 What You Learn
Ethical sourcing, connector design, retrieval quality for people systems
