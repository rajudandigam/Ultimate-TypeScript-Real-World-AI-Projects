System Type: Agent  
Complexity: Level 4  
Industry: Security / Identity  
Capabilities: Monitoring, Risk scoring  

# Zero Trust Behavioral Authenticator

## 🧠 Overview
Continuously scores **session and device behavior** (typing cadence patterns—not raw keylogging where prohibited, app usage sequences, geo velocity, resource access graphs) to produce a **dynamic trust score** that **steps up MFA**, **throttles sensitive APIs**, or **forces re-auth**—complements static IAM with **risk-adaptive** policies; **privacy and legal review** required for behavioral biometrics jurisdictions.

---

## 🎯 Problem
Stolen sessions and token replay bypass one-time MFA at login; coarse IP allowlists block remote work.

---

## 💡 Why This Matters
- **Pain it removes:** Lateral movement after initial compromise and blind trust in VPN perimeter.
- **Who benefits:** Enterprise security teams implementing zero trust.

---

## 🏗️ System Type
**Chosen:** **Single Agent** assisting **risk analysts** and **policy authors** with narratives; **online scoring** is **workflow + ML models** with immutable feature pipelines—not LLM-in-the-hot-path.

---

## ⚙️ Complexity Level
**Target:** Level 4 — streaming features, model governance, and fairness constraints.

---

## 🏭 Industry
Security / IAM

---

## 🧩 Capabilities
Monitoring, Decision making, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Node.js, Kafka feature bus, Flink or Materialize for windows, Snowflake export, Python model serving (ONNX), Okta/Azure AD hooks, OpenTelemetry, Postgres policy store

---

## 🧱 High-Level Architecture
Identity events → feature extractor → **risk models** → policy engine → **Authenticator Agent** drafts analyst summaries on alerts → SOAR webhook optional

---

## 🔄 Implementation Steps
1. Geo-velocity + impossible travel baseline  
2. Resource sensitivity labels in authZ graph  
3. Device posture signals (MDM)  
4. Shadow mode scoring for months  
5. Gradual enforcement tiers per app criticality  

---

## 📊 Evaluation
FPR at fixed catch rate on red-team exercises, MTTD for simulated lateral movement, user friction metrics (extra MFA per user-month)

---

## ⚠️ Challenges & Failure Cases
**Bias against travelers**; noisy mobile IPs; **false sense** if attacker mimics slow patterns—fairness testing, cohort calibration, combine signals, never single-signal block for HR-critical apps without human policy

---

## 🏭 Production Considerations
GDPR/BIOMETRIC law mapping, user notice and consent flows, data minimization, explainability to helpdesk without leaking attacker info

---

## 🚀 Possible Extensions
Peer group anomaly (“this user unlike their team”) with strong privacy aggregation

---

## 🤖 Agent breakdown
- **Online scorer (non-LLM):** consumes feature vectors → outputs risk score + top features.  
- **Policy engine:** maps score bands to actions (step-up, block, log).  
- **Analyst copilot agent:** ingests incident JSON to suggest investigation steps (read-only on prod data).

---

## 🎓 What You Learn
Zero trust continuous auth, streaming risk features, responsible use of behavioral signals
