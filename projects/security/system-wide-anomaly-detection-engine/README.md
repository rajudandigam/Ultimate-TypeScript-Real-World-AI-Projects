System Type: Workflow  
Complexity: Level 3  
Industry: Security  
Capabilities: Detection  

# System-Wide Anomaly Detection Engine

## 🧠 Overview
A **metrics-, log-, and behavior-aware workflow** that builds **baseline models** per entity (user, host, service), scores **multivariate anomalies**, and routes **high-signal events** to **on-call** with **explainable features**—designed for **low false-positive** operations at cloud scale.

---

## 🎯 Problem
Traditional static thresholds miss slow burns; naive ML floods analysts. You need **consistent feature pipelines** and **controlled sensitivity** per asset class.

---

## 💡 Why This Matters
- **Pain it removes:** Blind spots between siloed tools and alert storms from naive z-scores.
- **Who benefits:** SOC, SRE, and security engineering teams defending hybrid estates.

---

## 🏗️ System Type
**Chosen:** **Workflow** — feature extraction, training windows, scoring, and suppression rules are **data pipelines**; optional **LLM** only formats **human summaries** from structured anomaly payloads.

---

## ⚙️ Complexity Level
**Target:** Level 3 — streaming joins, seasonal baselines, and org-specific policies.

---

## 🏭 Industry
Security / observability

---

## 🧩 Capabilities
Detection, Monitoring, Automation, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, Kafka/Pulsar or cloud logging sinks, ClickHouse or BigQuery, Flink/Beam (or managed stream), Prometheus/Mimir, Grafana, OpenTelemetry, isolation forests / robust PCA in Python sidecars callable from TS orchestrator

---

## 🧱 High-Level Architecture
Telemetry ingest → feature store → baseline trainer (scheduled) → real-time scorer → dedupe/suppress → incident workflow → feedback loop labels

---

## 🔄 Implementation Steps
1. Single signal (failed logins) with thresholds  
2. Add seasonal baselines per cohort  
3. Multi-signal fusion rules  
4. Analyst feedback → semi-supervised reweight  
5. Cross-account anomaly export for MSSPs  

---

## 📊 Evaluation
Precision@k on labeled incidents, MTTD/MTTR deltas, noise ratio per team, infra cost per TB ingested

---

## ⚠️ Challenges & Failure Cases
Concept drift after releases; coordinated low-and-slow attacks; **legitimate bulk jobs** flagged—cohort segmentation, change calendars, allowlists with expiry, adversarial feedback poisoning

---

## 🏭 Production Considerations
PII minimization in raw logs, encryption keys rotation, tenant isolation, sampling under pressure with bias awareness

---

## 🚀 Possible Extensions
Graph edges (lateral movement) layered on top of statistical anomalies

---

## 🔁 Evolution Path
Thresholds → seasonal stats → streaming ML → workflow-governed fusion with human labels

---

## 🎓 What You Learn
Feature stores for security, streaming scoring, operating ML in SOCs responsibly
