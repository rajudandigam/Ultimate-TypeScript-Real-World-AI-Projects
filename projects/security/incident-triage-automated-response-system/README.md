System Type: Multi-Agent  
Complexity: Level 4  
Industry: Security  
Capabilities: Orchestration  

# Incident Triage & Automated Response System

## 🧠 Overview
A **multi-agent SOC copilot** that **classifies incidents**, **gathers evidence** across tools (EDR, IAM, cloud audit), proposes **containment steps**, and **executes approved playbooks** inside **policy sandboxes**—human **approve/deny** gates for destructive actions.

*Catalog note:* Complements **`Multi-Agent Incident Response System`** under DevOps by centering **security operations**, **evidence chains**, and **regulated response** patterns.

---

## 🎯 Problem
Incidents arrive faster than tier-1 can enrich; runbooks drift; automation without governance creates **blast radius**.

---

## 💡 Why This Matters
- **Pain it removes:** Context switching across consoles and inconsistent containment.
- **Who benefits:** SOC tiers, IR retainers, and CISO programs measuring response quality.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Triage**, **Forensics**, and **Responder** agents coordinate via a **supervisor** with **immutable audit logs**.

---

## ⚙️ Complexity Level
**Target:** Level 4 — tool-rich orchestration with graded autonomy.

---

## 🏭 Industry
Security operations / incident response

---

## 🧩 Capabilities
Orchestration, Automation, Decision making, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI Agents SDK / Mastra, SOAR APIs (Splunk Phantom, Torq, custom), cloud CLIs behind service accounts, Vault for secrets, Postgres case DB, OpenTelemetry

---

## 🧱 High-Level Architecture
Alert ingest → normalize → **Triage Agent** (severity, dupe) → **Forensics Agent** (queries) → **Responder Agent** (draft actions) → human approval UI → execution worker with lease locks

---

## 🔄 Implementation Steps
1. Read-only enrichment only  
2. Soft actions (disable API key) with dual control  
3. Network isolation playbooks per cloud  
4. Post-incident timeline export (PDF/JSON)  
5. Simulations against synthetic alerts  

---

## 📊 Evaluation
Time-to-first-evidence, false containment rate, playbook success %, analyst satisfaction, audit pass rate

---

## ⚠️ Challenges & Failure Cases
**Over-automation** locks out admins; hallucinated commands; tool latency causes stale decisions—command dry-run, mandatory MFA on execution, TTL on isolations, rollback recipes

---

## 🏭 Production Considerations
Least-privilege service accounts, break-glass accounts, jurisdiction of data access, evidence retention, on-call paging budgets

---

## 🚀 Possible Extensions
Purple-team “fire drill” mode with synthetic attacks to regression-test agents

---

## 🔁 Evolution Path
Static runbooks → supervised agents → policy-graded autonomy with continuous evaluation

---

## 🎓 What You Learn
SOAR design, safe automation, multi-agent governance in high-stakes ops
