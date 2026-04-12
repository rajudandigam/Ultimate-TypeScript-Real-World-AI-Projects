System Type: Workflow  
Complexity: Level 2  
Industry: Real Estate  
Capabilities: Automation  

# Maintenance Request Automation System

## 🧠 Overview
**Workflows** triage **tenant/property maintenance requests** from portal, SMS, or email: classify urgency, route to **vendor**, schedule **SLA timers**, and track **completion proofs**—optional LLM classifies **intent + urgency** from text with **confidence thresholds** sending unknowns to humans.

---

## 🎯 Problem
After-hours leaks and HVAC failures get lost; vendors miss SLAs without a single system of record.

---

## 💡 Why This Matters
Protects assets, tenant satisfaction, and warranty compliance across portfolios.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first).

---

## ⚙️ Complexity Level
**Target:** Level 2. Routing + notifications + vendor APIs; L3+ adds parts inventory and predictive maintenance hooks.

---

## 🏭 Industry
Property management / facilities

---

## 🧩 Capabilities
Automation, Classification, Monitoring, Observability

---

## 🛠️ Suggested TypeScript Stack
Temporal/Inngest, Node.js, Twilio/email, Yardi/Buildium/AppFolio APIs, ServiceTitan/work order APIs, Postgres, OpenTelemetry

---

## 🧱 High-Level Architecture
Intake → classify → create WO → vendor assignment rules → SLA escalations → completion photo/invoice attach → tenant notify

---

## 🔄 Implementation Steps
Manual triage queue → rules by keywords → LLM assist with schema → vendor roster integration → mobile tenant portal status

---

## 📊 Evaluation
Time-to-dispatch, first-time fix rate, SLA breach rate, tenant CSAT, vendor invoice error rate

---

## ⚠️ Challenges & Failure Cases
Misclassified emergencies; duplicate tickets; vendor API outage; PII in public SMS threads; LLM suggesting unlicensed trades—escalation paths, dedupe keys, templates, license checks

---

## 🏭 Production Considerations
After-hours on-call rotations, licensed contractor verification, insurance certs, audit trail for liability, multilingual templates

---

## 🚀 Possible Extensions
IoT sensor triggers (leak detectors), warranty auto-lookup

---

## 🔁 Evolution Path
Email rules → durable workflows → LLM triage assist → predictive maintenance layer

---

## 🎓 What You Learn
Ops orchestration for physical assets, vendor integrations, SLA design
