System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Matching, Retrieval  

# Clinical Trial Matching Agent

## 🧠 Overview
Matches **structured eligibility criteria** (from ClinicalTrials.gov-style JSON or sponsor systems) to **patient profiles** with explicit **exclusion logic** executed in code; the **agent explains** why a trial fits or fails with **citations to criteria lines**—**not** enrollment authority; clinicians decide.

---

## 🎯 Problem
Patients and sites miss relevant trials buried in text. Need **transparent** boolean + NLP hybrid over **authoritative** trial records.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `search_trials`, `evaluate_eligibility_rule`, `fetch_pi_contact`.

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Healthcare / oncology ops / patient navigation.

---

## 🧩 Capabilities
Matching, Retrieval, Reasoning, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Postgres**/OpenSearch index of trials, **OpenAI SDK**, FHIR for patient summary (consent).

---

## 🧱 High-Level Architecture
Patient summary (minimized) → agent → trial search → rule engine results → explainable UI.

---

## 🔄 Implementation Steps
Keyword search → structured criteria parser → rule engine → LLM explanations only from engine JSON.

---

## 📊 Evaluation
Precision of “eligible” suggestions vs chart review sample; false hope rate (critical).

---

## ⚠️ Challenges & Failure Cases
**Outdated** trial status—refresh cadence. **PHI** in prompts—minimize. **Hallucinated** arms—tool-only trial facts.

---

## 🏭 Production Considerations
HIPAA, consent, IRB considerations for outreach, audit, bias across demographics (monitor).

---

## 🚀 Possible Extensions
Site feasibility scoring, referral workflow, multilingual criteria.

---

## 🔁 Evolution Path
Search → rules → agent explain → optional site-specific overrides.

---

## 🎓 What You Learn
Eligibility modeling, evidence-linked patient comms, clinical ops ethics.
