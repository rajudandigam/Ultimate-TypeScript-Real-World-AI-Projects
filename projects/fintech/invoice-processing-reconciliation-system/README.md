System Type: Workflow  
Complexity: Level 2  
Industry: Fintech  
Capabilities: Extraction, Matching  

# Invoice Processing & Reconciliation System

## 🧠 Overview
A **workflow** that **extracts** invoice line items (OCR + templates), **matches** to purchase orders and receipts using **deterministic keys** (PO number, amount tolerance, vendor id), and **flags discrepancies** for AP review—distinct from the **Finance** “Invoice Processing Pipeline” by emphasizing **three-way match** and **exception queues**.

---

## 🎯 Problem
AP teams chase mismatched totals, duplicate payments, and missing PO links. Automation must be **explainable** and **idempotent**.

---

## 🏗️ System Type
**Chosen:** Workflow (ETL + match + exception routing).

---

## ⚙️ Complexity Level
**Target:** Level 2. Extraction + matching rules; grow toward L3–L4 with ML matching.

---

## 🏭 Industry
Fintech / B2B payments / AP automation.

---

## 🧩 Capabilities
Extraction, Matching, Automation, Validation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Inngest**/**Temporal**, **Node.js**, **S3**, **Postgres**, OCR vendor or **Textract**.

---

## 🧱 High-Level Architecture
Upload → OCR → normalize → match engine → post to ERP or queue exceptions.

---

## 🔄 Implementation Steps
Template invoices → OCR → PO master join → tolerance rules → human exception UI.

---

## 📊 Evaluation
Match rate, $ disputed recovered, time-to-close, false match rate (critical KPI).

---

## ⚠️ Challenges & Failure Cases
OCR garbage; **wrong PO link**—mitigate confidence thresholds + human confirm. Duplicate payments—idempotency keys. Vendor format drift—template versioning.

---

## 🏭 Production Considerations
Audit trail, segregation of duties, encryption, ERP API rate limits, SOX-style controls if applicable.

---

## 🚀 Possible Extensions
ML line pairing, global vendor network dedupe, early pay discount optimizer.

---

## 🔁 Evolution Path
Rules → ML assist → workflow orchestration → optional agent for exception narratives.

---

## 🎓 What You Learn
Three-way match, idempotent payments, AP exception workflows.
