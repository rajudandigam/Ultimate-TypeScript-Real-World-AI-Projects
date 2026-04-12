System Type: Agent  
Complexity: Level 4  
Industry: Security / Insider Risk  
Capabilities: Behavioral analysis, Monitoring  

# Continuous Insider Threat Detection Agent

## 🧠 Overview
An **insider-risk analytics agent** that correlates **identity, access, DLP, endpoint, and business application signals** into **time-bounded risk scores** and **investigation briefs** for SOC/Insider Risk teams—**distinct** from session-only zero trust scoring: this system emphasizes **crown-jewel data paths**, **privilege escalation**, **mass download anomalies**, and **SIEM-native** workflows with **HR/legal governance** hooks.

*Catalog note:* Complements **`Zero Trust Behavioral Authenticator`** (continuous **access** trust for sessions). This project targets **insider threat programs** (UEBA-style) with **case management** and **evidence packaging**, not primary authentication.

---

## 🎯 Problem
Attackers with valid credentials exfiltrate slowly; siloed alerts miss sequences; investigations drown in raw logs without narrative.

---

## 💡 Why This Matters
- **Pain it removes:** Late detection of departing-employee theft and compromised power users.
- **Who benefits:** Insider risk, SOC, and employee relations under policy.

---

## 🏗️ System Type
**Chosen:** **Single Agent** for **analyst copilot** summaries and **query planning**; **streaming scoring** and **rules** remain **deterministic services** feeding the SIEM.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-source correlation, governance, and high-stakes false positive control.

---

## 🏭 Industry
Enterprise security

---

## 🧩 Capabilities
Behavioral analysis, Monitoring, Decision making, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Kafka feature bus, Splunk/Microsoft Sentinel APIs, Okta/Entra ID, DLP exports, Postgres case store, OpenAI SDK (structured briefs only), OpenTelemetry

---

## 🧱 High-Level Architecture
Normalized events → **feature windows** → **risk scorer** → threshold → **Insider Threat Agent** composes timeline + hypotheses → case in SOAR → human disposition → feedback labels

---

## 🔄 Implementation Steps
1. High-value asset catalog + access baselines  
2. Sequence detectors (download → share → USB) with cooldowns  
3. Offboarding risk flags with HR workflow integration  
4. Privacy-preserving aggregates (no keystroke logging by default)  
5. Red-team insider playbooks quarterly  

---

## 📊 Evaluation
MTTD for simulated insider chains, false positive rate per 1k employees, analyst time-to-triage, case closure quality audits

---

## ⚠️ Failure Scenarios
**Work-from-travel** false positives; **union/legal** sensitivity on “behavior”; **bias against contractors**—jurisdiction-aware policies, human review for HR-visible actions, fairness monitoring, explicit employee notice where required

---

## 🤖 Agent breakdown
- **Feature pipeline (non-LLM):** rolling stats, rare access, mass object reads.  
- **Scoring engine:** ensemble + rule fusion with versioned models.  
- **Investigation agent:** reads **only** aggregated case JSON + SIEM snippets to propose next queries (no PII in model logs beyond policy).  
- **Policy gate:** blocks automated punitive HR actions—recommendations only.

---

## 🎓 What You Learn
UEBA design, SIEM correlation, governance for workplace monitoring
