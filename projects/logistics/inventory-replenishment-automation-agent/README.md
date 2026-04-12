System Type: Agent  
Complexity: Level 3  
Industry: Logistics  
Capabilities: Automation  

# Inventory Replenishment Automation Agent

## 🧠 Overview
Proposes **purchase orders** or **transfer orders** by combining **ROP/EOQ policies**, **supplier lead times**, **forecast outputs**, and **constraints** (MOQ, pallets, budget caps) via tools—**ERP write** is **policy-gated** with **simulation preview**; agent explains **SKUs/lines** from **computed tables**, not invented quantities.

---

## 🎯 Problem
Buyers spend time on repetitive min-max tuning; stockouts happen when overrides are untracked.

---

## 💡 Why This Matters
Working capital and fill rate balance across DC network.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using) over planning engine APIs.

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Inventory planning / procurement

---

## 🧩 Capabilities
Automation, Prediction, Optimization, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, SAP/NetSuite/Dynamics APIs, forecast service, rules engine, OpenAI SDK, Postgres approval ledger, OpenTelemetry

---

## 🧱 High-Level Architecture
Signals → replenishment engine proposes lines → agent narrates + flags exceptions → buyer approves → ERP PO create with idempotency

---

## 🔄 Implementation Steps
Suggest-only mode → dual approval for $ caps → auto-submit low-risk SKUs → continuous monitoring of receipt variance

---

## 📊 Evaluation
Fill rate, inventory $, PO count reduction, stockout incidents, buyer override rate

---

## ⚠️ Challenges & Failure Cases
Double POs; wrong UOM; supplier split rules ignored; forecast shock buys too much—idempotency keys, UOM validation, circuit breakers, human gates for new suppliers

---

## 🏭 Production Considerations
Financial controls, segregation of duties, audit trail, fraud detection on vendor bank changes (separate system)

---

## 🚀 Possible Extensions
Multi-echelon balancing, allocation during shortage fair-share rules

---

## 🔁 Evolution Path
ROP spreadsheets → engine + human → agent explain → partial autonomy with guardrails

---

## 🎓 What You Learn
ERP write safety, supply planning UX, idempotent procurement automation
