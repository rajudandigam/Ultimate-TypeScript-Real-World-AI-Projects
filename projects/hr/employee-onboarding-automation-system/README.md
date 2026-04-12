System Type: Workflow  
Complexity: Level 2  
Industry: HR  
Capabilities: Automation  

# Employee Onboarding Automation System

## 🧠 Overview
**Durable workflows** orchestrate **Day-1 tasks**: accounts, hardware, trainings, policy acknowledgements, and **buddy/manager nudges**—with **SLA timers**, **HRIS/ITSM integrations**, and optional **LLM-generated personalized copy** only from **approved templates** and **HRIS facts** (start date, role, location).

---

## 🎯 Problem
New hires stall in limbo between IT, HR, and managers; checklists in spreadsheets are forgotten under load.

---

## 💡 Why This Matters
- **Pain it removes:** Bad first-week experience, compliance gaps on trainings, and ops toil.
- **Who benefits:** People ops and IT in growing companies.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). LLM optional for messaging only.

---

## ⚙️ Complexity Level
**Target:** Level 2. Integrations + reminders + forms; L3+ adds intelligent dependency resolution across global entities.

---

## 🏭 Industry
HR / people operations

---

## 🧩 Capabilities
Automation, Planning, Observability, Personalization (bounded)

---

## 🛠️ Suggested TypeScript Stack
Temporal/Inngest, Node.js, Workday/BambooHR APIs, Okta/Google Workspace, Jira/ServiceNow, Postgres, OpenTelemetry

---

## 🧱 High-Level Architecture
Onboarding controller → per-hire workflow instance → task steps with compensations → notifications → completion proofs in audit store

---

## 🔄 Implementation Steps
Static checklist → HRIS-triggered workflows → IT provisioning hooks → training LMS APIs → optional LLM welcome emails from template slots

---

## 📊 Evaluation
Time-to-ready (accounts+device), training completion % before day 14, ticket volume to HR, new hire survey NPS

---

## ⚠️ Challenges & Failure Cases
Wrong start date propagation; missed hardware stock; access before background check cleared; LLM leaking manager notes; workflow stuck without escalation—use idempotency, stock checks, policy gates, template-only LLM, watchdog timers

---

## 🏭 Production Considerations
PII minimization, least-privilege API keys to IT systems, SOC2 logging, regional employment law variations, break-glass manual overrides

---

## 🚀 Possible Extensions
Manager dashboard, offboarding mirror workflow, contractor-specific tracks

---

## 🔁 Evolution Path
Checklists → integrated workflows → personalized comms → optional agent assists

---

## 🎓 What You Learn
Cross-functional orchestration, HRIS/IT identity join patterns, employee journey reliability
