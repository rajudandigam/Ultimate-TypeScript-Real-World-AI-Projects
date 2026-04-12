System Type: Agent  
Complexity: Level 4  
Industry: Enterprise Knowledge  
Capabilities: Knowledge graph, Retrieval  

# Organizational Memory Graph Builder

## 🧠 Overview
Builds a **living knowledge graph** across **documents, Slack/Teams, and mail** (where legally ingested) that links **people, decisions, systems, and customer entities**—powers **contextual retrieval** (“who decided X, when, and why”) with **ACL-aware expansion** and **temporal validity** (reorgs, renamed services). **Distinct** from flat **RAG over chunks**: this project is **graph-first** with **typed edges** and **provenance** on every relationship.

*Catalog note:* Complements **`Enterprise RAG Knowledge Platform (Permission-Aware)`** (doc Q&A). Use this when the product is **entity-centric memory** (orgs, launches, incidents) with **graph traversals** + optional RAG on attached evidence nodes.

---

## 🎯 Problem
Institutional memory lives in chat scrollback; postmortems repeat mistakes; onboarding cannot find “the real owner” of a dependency.

---

## 💡 Why This Matters
- **Pain it removes:** Fragmented truth and slow cross-functional alignment after leadership changes.
- **Who benefits:** Engineering leadership, program management, and sales/solution architects.

---

## 🏗️ System Type
**Chosen:** **Single Agent** for **guided graph expansion** and **query decomposition**; **ETL + entity resolution** are **workflow/batch** systems of record.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-connector ETL, disambiguation, and strict authz.

---

## 🏭 Industry
Enterprise knowledge / collaboration intelligence

---

## 🧩 Capabilities
Knowledge graph, Retrieval, Reasoning, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Node.js, Neo4j or Neptune or Postgres+AGE, dbt for staging, Slack/Graph APIs, Microsoft Graph (scoped), OpenSearch for evidence text, OpenAI SDK tool calling, OpenTelemetry

---

## 🧱 High-Level Architecture
Connectors → **silver layer** (normalized events) → **entity resolver** → **graph upsert jobs** → **Memory Agent** answers path queries + pulls evidence snippets → UI explorer + API for copilots

---

## 🔄 Implementation Steps
1. Docs-only MVP with manual entity tags  
2. Slack thread → decision edge extraction with human QA  
3. Reorg-aware identity mapping (email → workday id)  
4. Customer 360 light (CRM id links) with DLP redaction  
5. “Time travel” graph views as-of date for audits  

---

## 📊 Evaluation
Query success rate on held-out questions, graph precision on labeled edges, connector freshness SLA, user trust in provenance clicks

---

## ⚠️ Failure Scenarios
**Wrong person linked** to a decision; **stale edges** after acquisition; **over-collection** of mail—human confirmation queues for sensitive edges, TTL on inferred links, legal minimization on mail bodies

---

## 🤖 Agent breakdown
- **Graph query planner:** decomposes NL into Cypher/GSQL sub-queries with limits.  
- **Evidence retriever:** fetches text for node ids user can access.  
- **Synthesis agent:** answers with **node/edge citations** only; refuses if subgraph empty.

---

## 🎓 What You Learn
Enterprise graphs at scale, consent-aware ingestion, graph+RAG hybrid patterns
