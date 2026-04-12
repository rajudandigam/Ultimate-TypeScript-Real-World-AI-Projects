System Type: Agent  
Complexity: Level 3  
Industry: R&D / IP  
Capabilities: Retrieval, Research  

# Patent Landscape Analyzer

## 🧠 Overview
Navigates **patent corpora + papers** (via **licensed APIs** or **bulk XML** where permitted) to map **white space**, **assignee clusters**, **claim element frequency**, and **potential FTO flags**—outputs are **evidence tables** with **document IDs**; **legal conclusions** remain with counsel.

---

## 🎯 Problem
Landscape memos take weeks; keyword search misses semantic neighbors; teams duplicate filings internally.

---

## 💡 Why This Matters
- **Pain it removes:** Slow portfolio strategy and surprise prior art in diligence.
- **Who benefits:** IP counsel, corporate strategy, and R&D leads.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **retrieval tools** (vector + metadata filters) and **structured extraction** for claim elements.

---

## ⚙️ Complexity Level
**Target:** Level 3 — large-scale retrieval, ranking, and careful disclaimers.

---

## 🏭 Industry
IP / innovation intelligence

---

## 🧩 Capabilities
Retrieval, Research, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenSearch + vector, Lens/PatentsView/USPTO APIs (compliance), Postgres matter tracking, OpenAI SDK structured outputs, OpenTelemetry

---

## 🧱 High-Level Architecture
Seed query → **Landscape Agent** expands synonyms/CPC filters → pulls corpus slice → clusters + timeline charts → gap narrative → export to counsel review workspace

---

## 🔄 Implementation Steps
1. CPC-class scoped baseline  
2. Assignee normalization graph  
3. Claim element extraction with human QC sampling  
4. Family grouping heuristics  
5. Watch mode for weekly deltas  

---

## 📊 Evaluation
Precision@k on known relevant docs, counsel time saved, false “FTO clear” incidents (must be zero unsafe language—use “needs review”)

---

## ⚠️ Challenges & Failure Cases
**Incomplete global coverage** if only one office; **hallucinated patent numbers**; confidential overlap with internal unpublished—strict numeric ID validation, separate air-gapped index for private filings, never assert legal outcomes

---

## 🏭 Production Considerations
API licensing costs, retention policies, export control, privilege workflows when mixing client confidential with public data

---

## 🚀 Possible Extensions
Opposition evidence packet assembly with exhibit numbering automation

---

## 🤖 Agent breakdown
- **Query expansion tool:** controlled synonym/CPC tables, not free-form web.  
- **Retriever agent:** hybrid search with date and jurisdiction filters.  
- **Analyst pass:** clusters, timelines, and gap statements tied to doc IDs only.

---

## 🎓 What You Learn
Patent-scale RAG, evidence discipline, legal-adjacent product boundaries
