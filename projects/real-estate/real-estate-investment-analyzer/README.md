System Type: Agent  
Complexity: Level 3  
Industry: Real Estate  
Capabilities: Financial Analysis  

# Real Estate Investment Analyzer

## 🧠 Overview
Builds **investment memos** for **acquisitions** by combining **rent roll**, **T-12**, **loan terms**, **tax/insurance**, and **market comps** via tools—outputs **cash-on-cash, DSCR sensitivities, exit scenarios** with **tables from compute engine**, not invented math; **not** investment advice—disclaimers and **data lineage** required.

---

## 🎯 Problem
Underwriting packs are repetitive; Excel models drift from source documents; teams need faster first-pass consistency.

---

## 💡 Why This Matters
Accelerates IC memos while preserving auditability for lenders and partners.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over a **deterministic financial core**.

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-tab ingestion + scenario narration; L5 would add full IC-grade governance and Monte Carlo fleets.

---

## 🏭 Industry
Real estate / acquisitions & REPE

---

## 🧩 Capabilities
Prediction, Reasoning, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, TS financial libs or Python sidecar for numpy, OpenAI SDK, document parsers, Postgres, Excel export, OpenTelemetry

---

## 🧱 High-Level Architecture
Deal room upload → extract tables to canonical schema → compute engine runs scenarios → agent narrates with citations to rows → PDF memo

---

## 🔄 Implementation Steps
Manual template → structured extraction → locked formulas in code → agent explains deltas → lender package checklist automation

---

## 📊 Evaluation
Numeric parity vs analyst gold models, time per deal, error rate on key ratios, reviewer edit distance

---

## ⚠️ Challenges & Failure Cases
OCR misreads rent; wrong unit count; LLM rounding errors vs engine; confidential data leaks—engine owns numbers, redact PII, version inputs, human sign-off for IC

---

## 🏭 Production Considerations
Deal room ACL, watermarking, retention, SOX-style access if public company adjacency, model version pinning

---

## 🚀 Possible Extensions
Portfolio rollup, debt quote scenario from lender API (licensed)

---

## 🔁 Evolution Path
Spreadsheet → structured deal DB → compute+narrate agent → portfolio intelligence

---

## 🎓 What You Learn
Real estate finance modeling boundaries, doc-to-schema ETL, IC memo automation ethics
