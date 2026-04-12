System Type: Agent  
Complexity: Level 4  
Industry: Enterprise AI  
Capabilities: Retrieval  

# Enterprise RAG Knowledge Platform (Permission-Aware)

## 🧠 Overview
An **enterprise knowledge platform** that **ingests** Confluence, SharePoint, Google Drive, Slack exports, and **tickets**, then serves a **permission-aware retrieval agent** that **never returns chunks the user cannot access**—enforced via **document ACL snapshots** joined at **query time**, not just at index time.

---

## 🎯 Problem
Classic RAG leaks snippets when ACLs drift; connectors are brittle; answers lack citations tied to authorized sources.

---

## 💡 Why This Matters
- **Pain it removes:** Shadow IT knowledge silos and risky “copy everything to one bucket” shortcuts.
- **Who benefits:** IT, legal, and employees who need trustworthy internal answers.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **retrieval tools** backed by **hybrid search** + **ACL filter** pushed down to the index layer.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-tenant ACLs, connector reliability, and evaluation at org scale.

---

## 🏭 Industry
Enterprise knowledge / compliance-heavy sectors

---

## 🧩 Capabilities
Retrieval, Reasoning, Observability, Personalization (per-role), Automation (optional sync)

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenSearch/Elasticsearch w/ document-level security, Postgres for ACL graphs, Temporal connectors, OpenAI SDK, OCR pipeline for PDFs, OpenTelemetry

---

## 🧱 High-Level Architecture
Connectors → normalization → ACL indexer → vector + BM25 index → **RAG Agent** (tools: search, fetch_doc) → answer w/ citations → feedback loop

---

## 🔄 Implementation Steps
1. Single source (e.g., Drive) with live permission checks  
2. Add hybrid retrieval + reranker  
3. HR/legal sensitivity tags on collections  
4. Continuous ACL diff sync  
5. Red-team tests for horizontal privilege escalation  

---

## 📊 Evaluation
**Authz test suite** pass rate, nDCG on internal benchmarks, citation accuracy, connector freshness SLAs

---

## ⚠️ Challenges & Failure Cases
Stale group memberships; **over-broad SharePoint inheritance**; OCR mangling tables—live IDP lookups for sensitive fetches, table-aware parsers, explicit “insufficient permission” responses vs silence

---

## 🏭 Production Considerations
Data residency, DLP scanning at ingest, retention policies, SIEM logging of queries, BYOK encryption

---

## 🚀 Possible Extensions
Project-scoped “temporary shares” for cross-vendor deals with auto-expiry

---

## 🔁 Evolution Path
Dump-and-index → ACL-aware search → agent answers → continuous trusted knowledge ops

---

## 🎓 What You Learn
Authz-aware retrieval, connector engineering, enterprise search security
