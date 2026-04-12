System Type: Agent  
Complexity: Level 3  
Industry: Security / Abuse  
Capabilities: Analysis, Automation  

# Automated Phishing Takedown Agent

## 🧠 Overview
Assists **trust & safety / security operations** by **clustering suspicious URLs and emails**, **corroborating** with **reputation feeds and sandboxed fetch metadata**, and **drafting takedown packages** (registrar, host, brand protection portals)—**distinct** from **`AI Phishing Detection System`** (classification at mailbox edge): this project focuses on **post-detection response automation** with **legal-process-aware** templates and **human approval** before outbound abuse mail.

---

## 🎯 Problem
Phishing domains propagate faster than manual abuse tickets; inconsistent evidence bundles get rejected by registrars; teams duplicate work across shifts.

---

## 💡 Why This Matters
- **Pain it removes:** Time-to-takedown and attacker dwell time on lookalike domains.
- **Who benefits:** Enterprise security, banks, and large consumer brands.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **tool calls** to WHOIS/RDAP, DNS history, screenshot sandboxes, and **ticketing APIs**; **workflow** enforces SLA and **dual control** on sends.

---

## ⚙️ Complexity Level
**Target:** Level 3 — integrations, evidence discipline, and policy.

---

## 🏭 Industry
Cyber abuse response

---

## 🧩 Capabilities
Analysis, Automation, Retrieval, Observability, Decision making

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK tools, VirusTotal/URLScan (licensed), RDAP clients, Playwright in disposable VMs, Postgres case store, Jira/ServiceNow, OpenTelemetry

---

## 🧱 High-Level Architecture
Ingest IOC → **Takedown Agent** gathers evidence bundle → risk score → human queue → approved → send templated abuse reports → poll status webhooks → escalate registrar chain

---

## 🔄 Implementation Steps
1. Internal lookalike domain watchlists only  
2. Add safe browsing + CT log correlation  
3. Brand logo hash matching with legal-approved thresholds  
4. Multi-language abuse templates by jurisdiction  
5. Metrics on median takedown hours by registrar  

---

## 📊 Evaluation
Median time-to-suspend domain, false positive takedown rate (legal review), evidence rejection rate by providers, analyst time saved

---

## ⚠️ Failure Scenarios
**Legitimate parked domain** collateral; **PII in phishing kit screenshots**—redaction pipeline, conservative auto-send tiers, legal sign-off for bulk actions, never DDoS or hack back

---

## 🤖 Agent breakdown
- **Correlator tools:** cluster URLs by TLS cert, AS, HTML hash.  
- **Evidence packer agent:** assembles PDF/JSON per provider spec.  
- **Drafter agent:** fills templates with **only** tool-sourced facts.  
- **Escalation policy:** rules for when human must edit before send.

---

## 🎓 What You Learn
Abuse ops automation, safe browsing at scale, governance for outbound legal comms
