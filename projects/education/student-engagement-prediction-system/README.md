System Type: Workflow  
Complexity: Level 2  
Industry: Education  
Capabilities: Prediction  

# Student Engagement Prediction System

## 🧠 Overview
**Scheduled workflows** compute **engagement features** (LMS logins, video watch %, assignment on-time rates, discussion participation) and apply **transparent rules + calibrated models** to flag **at-risk students** for **advisor outreach**—outputs are **signals**, not disciplinary decisions; **FERPA** governs data minimization and **appeal** pathways.

---

## 🎯 Problem
Dropout risk is visible too late; instructors lack a **privacy-respecting** early warning layer grounded in **LMS facts**.

---

## 💡 Why This Matters
- **Pain it removes:** Silent disengagement, inequitable support allocation, and reactive retention campaigns.
- **Who benefits:** Advising offices and instructors in online and hybrid programs.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Nightly ETL, feature materialization, scoring, and notifications are pipelines; optional LLM drafts **advisor email templates** from structured risk JSON only.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Feature engineering + simple models/rules + reporting; L3+ adds richer sequences and fairness-aware ML with institutional review boards.

---

## 🏭 Industry
Example:
- Education / student success technology

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — advising playbooks (internal)
- Planning — bounded (outreach cadence suggestions)
- Reasoning — optional NL explanation from feature tables only
- Automation — advisor notifications (policy gated)
- Decision making — bounded (risk tier assignment)
- Observability — **in scope**
- Personalization — per-program thresholds
- Multimodal — n/a core

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Inngest** / **Temporal** for schedules
- **Node.js + TypeScript** ETL
- **Snowflake/BigQuery/Postgres** warehouse
- **Canvas/Blackboard** data exports or APIs
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** LMS exports, xAPI events, SIS enrollment snapshots (scoped).
- **LLM layer:** Optional template writer fed only `(student_id, risk_tier, drivers[])`.
- **Tools / APIs:** LMS/SIS connectors (read-first), email/SMS gateways with consent flags.
- **Memory (if any):** Feature tables + model registry; audit of tier changes.
- **Output:** Advisor caseload lists, CRM tasks, anonymized cohort dashboards.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rule: missed 2 consecutive assignments → flag.

### Step 2: Add AI layer
- LLM drafts advisor outreach from explicit bullet facts.

### Step 3: Add tools
- Ingest clickstream aggregates with differential privacy options for dashboards.

### Step 4: Add memory or context
- Track intervention outcomes to recalibrate thresholds each term.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agent suggests **resource links** from curated catalog only.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Precision/recall vs eventual dropout labels (careful base rates).
- **Latency:** Freshness of risk scores after nightly ETL.
- **Cost:** Warehouse + optional LLM for templates.
- **User satisfaction:** Advisor qualitative feedback; reduced false alarm fatigue.
- **Failure rate:** Bias against part-time students, wrong cohort inclusion, notification fatigue.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Irrelevant if LLM only sees structured drivers; never invent grades.
- **Tool failures:** Missing LMS export; mark cohort stale; do not send silent wrong flags.
- **Latency issues:** Late files; SLA alerts to data engineering, not risky defaults.
- **Cost spikes:** Reprocessing full history; incremental merges keyed by `event_id`.
- **Incorrect decisions:** Stigmatizing labels visible to peers; strict RBAC and private advisor views only.

---

## 🏭 Production Considerations

- **Logging and tracing:** Tier changes with model version; avoid logging sensitive notes in plaintext.
- **Observability:** Data freshness, join error rates, intervention completion metrics.
- **Rate limiting:** Notification caps per student per week; consent checks.
- **Retry strategies:** Idempotent ETL loads; safe replays after schema migrations.
- **Guardrails and validation:** Institutional IRB/ethics review for certain uses; opt-out handling.
- **Security considerations:** FERPA, least-privilege SIS scopes, encryption, retention schedules.

---

## 🚀 Possible Extensions

- **Add UI:** Advisor cockpit with explainable drivers and intervention templates.
- **Convert to SaaS:** Multi-tenant student success platform module.
- **Add multi-agent collaboration:** Separate “resource recommender” with hard allowlist links.
- **Add real-time capabilities:** Near-real-time triggers on login absence streaks (careful UX).
- **Integrate with external systems:** Salesforce Education Cloud, Civitas, Starfish.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **measurement fairness + privacy** before widening automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Educational data** governance
  - **Early alert** system design
  - **Calibration** with human outcomes
  - **System design thinking** for ethical student analytics
