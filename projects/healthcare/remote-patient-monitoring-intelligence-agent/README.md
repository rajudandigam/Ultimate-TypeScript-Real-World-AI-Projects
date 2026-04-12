System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Monitoring  

# Remote Patient Monitoring Intelligence Agent

## 🧠 Overview
An **RPM copilot** that ingests **device vitals streams** (HR, SpO₂, BP, weight, glucometry), detects **trend anomalies** vs personalized baselines, and triages **alerts to care teams** with **contextual summaries** and **suggested next steps**—aligned with **clinical escalation protocols** and **HIPAA** telemetry handling.

---

## 🎯 Problem
Raw thresholds create false alarms; nurses cannot watch dashboards 24/7; patients churn when alerted too often.

---

## 💡 Why This Matters
- **Pain it removes:** Alert fatigue and delayed escalation for true deteriorations.
- **Who benefits:** Chronic care programs, cardiology HF clinics, and post-acute monitoring vendors.

---

## 🏗️ System Type
**Chosen:** **Single Agent** over **time-series tools** and **EHR snapshot** tools; durable ingestion is **workflow**-driven.

---

## ⚙️ Complexity Level
**Target:** Level 3 — streaming signals, personalization, and safety rails.

---

## 🏭 Industry
Healthcare / digital health

---

## 🧩 Capabilities
Monitoring, Prediction, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, MQTT/HTTP ingest, TimescaleDB, FHIR Observation writer, OpenAI SDK for bounded narratives, Redis windows, Grafana, OpenTelemetry, Twilio/secure messaging for escalations

---

## 🧱 High-Level Architecture
Devices → gateway → normalization → rolling features → **RPM Agent** → severity + rationale → escalation workflow → EHR documentation assist (human finalized)

---

## 🔄 Implementation Steps
1. Threshold + rate-of-change rules baseline  
2. Per-patient baseline learning with guardrails  
3. Integrate care plan and meds for context  
4. Closed-loop tracking of interventions  
5. Edge offline buffering on mobile gateways  

---

## 📊 Evaluation
Sensitivity/specificity vs clinician labels on episodes, alert burden per patient-week, time-to-nurse review, patient-reported nuisance scores

---

## ⚠️ Challenges & Failure Cases
**Sensor dropout** mimicking bradycardia; **motion artifact**; demographic bias in baselines—multi-signal agreement rules, device quality flags, human-in-loop for high-stakes cohorts, explicit uncertainty in summaries

---

## 🏭 Production Considerations
Encrypted transport, device identity, SOC2 for vendor ops, state licensure for triage nurses, audit logs for every automated page

---

## 🚀 Possible Extensions
RPM + symptom NLP from patient free-text with strict moderation

---

## 🔁 Evolution Path
Static thresholds → personalized baselines → agent-triage with escalation playbooks → outcomes-linked retraining loops

---

## 🎓 What You Learn
Streaming health data, safe alerting UX, regulated monitoring pipelines
