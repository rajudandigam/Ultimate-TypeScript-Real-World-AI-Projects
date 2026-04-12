System Type: Workflow  
Complexity: Level 2  
Industry: Healthcare  
Capabilities: Extraction, Automation  

# Patient Intake Automation System

## 🧠 Overview
**HIPAA-aware** intake workflows: capture forms/OCR, **validate** insurance and demographics, map to **EHR fields**, and route exceptions to staff—**not** a substitute for clinical judgment. Requires **BAAs**, **minimum necessary** PHI, and **human sign-off** where your compliance team mandates.

---

## 🎯 Problem
Manual intake causes errors, denials, and long wait times. Automation must be **auditable** and **reversible**.

---

## 🏗️ System Type
**Chosen:** Workflow (ingest → validate → write to EHR via FHIR/API → notify).

---

## ⚙️ Complexity Level
**Target:** Level 2–3 boundary; start L2 with rules + OCR.

---

## 🏭 Industry
Healthcare / ambulatory / hospital registration.

---

## 🧩 Capabilities
Extraction, Automation, Validation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Temporal**/**Inngest**, **Node.js**, **FHIR** client, **Postgres** (encrypted), OCR vendor, **OpenTelemetry**.

---

## 🧱 High-Level Architecture
Kiosk/web form → workflow → validation services → EHR write adapter → audit.

---

## 🔄 Implementation Steps
PDF forms → structured fields → eligibility check stub → FHIR Patient/Coverage create → staff queue for failures.

---

## 📊 Evaluation
Field error rate, time-to-ready, denial rate delta, staff override rate.

---

## ⚠️ Challenges & Failure Cases
OCR misread MRNs—**double human confirm** for critical IDs. **Wrong patient** merge—strong dedupe keys. Vendor API down—queue + SLA alerts. **PHI** in logs—redaction.

---

## 🏭 Production Considerations
HIPAA, encryption, access logs, retention, break-glass, disaster recovery, state privacy laws.

---

## 🚀 Possible Extensions
Eligibility real-time, multilingual forms, e-sign.

---

## 🔁 Evolution Path
Rules → ML assist → full workflow with exception analytics.

---

## 🎓 What You Learn
FHIR basics, PHI-safe pipelines, front-desk operations engineering.
