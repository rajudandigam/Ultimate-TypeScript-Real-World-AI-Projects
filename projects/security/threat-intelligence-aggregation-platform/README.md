System Type: Multi-Agent  
Complexity: Level 4  
Industry: Security  
Capabilities: Monitoring  

# Threat Intelligence Aggregation Platform

## 🧠 Overview
A **multi-agent control plane** that **ingests heterogeneous threat feeds** (STIX bundles, vendor APIs, internal detections), runs **specialist agents** for **deduplication, correlation, and graph linking**, and produces **SOC-ready timelines** with **confidence-scored edges**—complements single-agent “ask intel” systems by focusing on **always-on fusion** and **playbook triggers**.

*Catalog note:* Distinct from **`AI Threat Intelligence Aggregator`** (agent-centric Q&A). This blueprint emphasizes **multi-agent pipelines** for feed normalization + correlation + automated routing.

---

## 🎯 Problem
Feeds disagree on the same campaign; IOC churn is high; analysts need **machine-speed correlation** without losing **provenance**.

---

## 💡 Why This Matters
- **Pain it removes:** Manual pivot tables across tools and missed lateral links during active incidents.
- **Who benefits:** SOC/CTI teams operating 24/7 fusion centers.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — separate agents for **ingest validation**, **entity resolution**, **hypothesis linking**, and **customer-facing briefing** with a **supervisor** enforcing policy.

---

## ⚙️ Complexity Level
**Target:** Level 4 — orchestrated specialists with shared graph state and guardrails.

---

## 🏭 Industry
Cybersecurity / threat intelligence

---

## 🧩 Capabilities
Monitoring, Retrieval, Reasoning, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Temporal, Neo4j or graph layer on Postgres, OpenSearch, OpenAI Agents SDK or Mastra, Kafka/PubSub, OpenTelemetry

---

## 🧱 High-Level Architecture
Connectors → raw landing zone → **Normalizer Agent** → **Entity-Resolution Agent** → graph writer → **Correlation Agent** → alert topics → optional **Briefing Agent** (grounded)

---

## 🔄 Implementation Steps
1. Two feeds + manual review UI  
2. STIX 2.1 canonical model  
3. Graph + time-window correlation rules  
4. Automated case creation with evidence links  
5. Drift monitors + red-team prompts for agent overreach  

---

## 📊 Evaluation
Graph precision/recall on labeled incidents, mean correlation latency, analyst edit distance on auto cases, false escalation rate

---

## ⚠️ Challenges & Failure Cases
**False fusion** across unrelated actors; poisoned feeds; PII in raw intel; agent “storytelling” without edges—immutable provenance fields, human gate for outbound automations, signed connector configs

---

## 🏭 Production Considerations
Data residency, classified handling tiers, retention policies, kill switch for auto-actions, cost caps on LLM steps

---

## 🚀 Possible Extensions
Purple-team simulation hooks that replay historical incidents for regression testing

---

## 🔁 Evolution Path
ETL-only → rule correlation → specialist agents → supervised multi-agent with graded autonomy

---

## 🎓 What You Learn
Intel graph modeling, multi-agent supervision, evidence-first automation in security
