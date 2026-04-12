System Type: Workflow  
Complexity: Level 2  
Industry: HR  
Capabilities: Monitoring  

# Employee Sentiment Monitoring System

## 🧠 Overview
**Workflows** ingest **anonymized or minimum-necessary** feedback (engagement surveys, optional public review sites where licensed, support tickets tagged HR-adjacent) and compute **themes + trends**; optional LLM summarizes **aggregated** buckets only—**no** individual surveillance framing; **attrition risk** outputs are **cohort-level** or **opt-in manager dashboards** per policy and **works council** constraints.

---

## 🎯 Problem
Leadership sees annual survey PDFs too late; emerging morale issues hide in noise until attrition spikes.

---

## 💡 Why This Matters
- **Pain it removes:** Slow response to systemic issues and weak follow-through on action plans.
- **Who benefits:** People analytics and ER teams in enterprises with mature privacy governance.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). ETL → theme detection → alerting; LLM optional on aggregates.

---

## ⚙️ Complexity Level
**Target:** Level 2. Scheduled jobs + dashboards + thresholds; L3+ adds hierarchical models with stronger fairness review.

---

## 🏭 Industry
HR / people analytics

---

## 🧩 Capabilities
Monitoring, Prediction (cohort risk scores), Automation (alerts), Observability

---

## 🛠️ Suggested TypeScript Stack
Inngest/Temporal, Node.js, survey APIs (Qualtrics/Culture Amp), warehouse (Snowflake), optional LLM for theme labels, OpenTelemetry

---

## 🧱 High-Level Architecture
Ingest → PII classification → aggregate store → topic/trend pipeline → dashboard + alert webhooks → action tracking workflow

---

## 🔄 Implementation Steps
Quarterly CSV import → automated survey API → theme model (classical or LLM-on-aggregates) → manager digests with thresholds → closed-loop action items

---

## 📊 Evaluation
Theme precision vs human coding sample, lead time on issues surfaced, false alert rate, employee trust (survey), legal review pass rate

---

## ⚠️ Challenges & Failure Cases
Re-identification from small teams; illegal monitoring perception; biased topic models; leaking verbatim comments in Slack alerts; vendor API outages—use k-anonymity rules, aggregate floors, redaction, human review queues, staleness banners

---

## 🏭 Production Considerations
Works council/EU consultation, retention schedules, DSAR, encryption, role-based access to verbatim vs themes only, ethics board sign-off for new sources

---

## 🚀 Possible Extensions
Pulse surveys integration, DEI-specific lenses with oversight

---

## 🔁 Evolution Path
Manual dashboards → automated ETL → LLM-labeled themes on aggregates → optional predictive HR copilots (high governance)

---

## 🎓 What You Learn
People analytics privacy engineering, workflow SLAs for HR signals, trustworthy aggregation
