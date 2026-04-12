System Type: Workflow  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Classification  

# Medical Coding & Billing Assistant

## 🧠 Overview
Workflow ingests **clinical documentation**, runs **NLP + rules** to propose **ICD/CPT/HCPCS** codes with **confidence**, validates against **payer edits** (where data available), and routes to **coder review**—**human coder** approves final codes; this is **not** autonomous billing submission without compliance sign-off.

---

## 🎯 Problem
Denials from under/over coding; coder shortage. Need **auditability** and **payer rule** integration.

---

## 🏗️ System Type
**Chosen:** Workflow (parse note → candidates → rules → review → export).

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Healthcare / RCM / coding vendors.

---

## 🧩 Capabilities
Classification, Validation, Automation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Temporal**, NLP models (hosted), **Postgres**, payer rulesets as data, **OpenTelemetry**.

---

## 🧱 High-Level Architecture
EHR note export → de-id pipeline → coding engine → coder workbench → billing system export.

---

## 🔄 Implementation Steps
Rules baseline → ML/NLP candidates → LLM **reformat** only from candidate list → denial feedback loop.

---

## 📊 Evaluation
First-pass acceptance rate, denial rate delta, coder time per chart.

---

## ⚠️ Challenges & Failure Cases
**Upcoding** risk—policy caps on auto-apply. **Hallucinated** codes—schema allowlist. **PHI** leakage—strict pipelines.

---

## 🏭 Production Considerations
HIPAA, coder licensing oversight, payer change management, audit logs per chart version.

---

## 🚀 Possible Extensions
DRG grouping assist, charge capture reconciliation.

---

## 🔁 Evolution Path
Suggest → semi-auto with thresholds → continuous learning from denials (governed).

---

## 🎓 What You Learn
RCM pipeline, coding compliance, human-in-loop ML deployment.
