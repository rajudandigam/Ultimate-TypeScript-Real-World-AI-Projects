System Type: Workflow  
Complexity: Level 2  
Industry: Healthcare  
Capabilities: Monitoring, Automation  

# Medication Adherence Monitoring System

## 🧠 Overview
A **durable workflow** that ingests **dispense events**, optional **IoT / smart packaging** signals, and **patient-reported** doses to compute **adherence windows**, send **consented reminders** (SMS/push/voice), and surface **clinician-friendly** streak views—with **PHI minimization**, **quiet hours**, and **audit trails** suitable for pharmacy and care-management pilots.

---

## 🎯 Problem
Non-adherence drives complications and readmissions; one-off reminders fail without **measurement**, **timing**, and **escalation** that respect consent and avoid alert fatigue.

---

## 💡 Why This Matters
- **Pain it removes:** Unknown whether a patient actually took a dose, manual phone trees, and generic nudges that patients ignore.
- **Who benefits:** Care managers, pharmacists, and accountable care programs running adherence programs under governed policies.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Adherence is **event-driven scheduling** (cron + per-patient timers), **idempotent ingestion**, and **notification fan-out**—a poor fit for an LLM as the spine. Optional LLM may **personalize copy** only from **approved phrase banks** (not medical advice).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Strong integrations + scheduling; L3+ adds richer personalization, multi-condition regimens, and deeper EHR write-backs.

---

## 🏭 Industry
Example:
- Healthcare / pharmacy / care management

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional policy FAQ for staff consoles only
- Planning — bounded (next reminder windows)
- Reasoning — minimal; rules engine preferred for clinical logic
- Automation — **in scope** (reminders, escalations)
- Decision making — bounded (threshold-based escalations)
- Observability — **in scope**
- Personalization — optional (tone from approved templates)
- Multimodal — optional (IVR)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** APIs
- **Inngest** or **Temporal** for durable timers and retries
- **Postgres** for patient schedules and event log
- **Twilio** / push providers (HIPAA-eligible SKUs where required)
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Pharmacy HL7/FHIR feeds, device webhooks, patient app “took dose” taps.
- **LLM layer:** Optional copy assistant constrained to templates (never changes schedule).
- **Tools / APIs:** Notification providers, EHR read-only flags (optional), admin console.
- **Memory (if any):** Long-lived schedule state + consent flags; avoid storing unnecessary PHI in logs.
- **Output:** Reminder delivery receipts, adherence dashboards, escalation tasks.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual CSV import of med list + simple daily SMS at fixed time.

### Step 2: Add AI layer
- Optional: LLM rewrites reminder text within template constraints (human-reviewed library).

### Step 3: Add tools
- Integrate pharmacy dispense feed; reconcile NDC/RxNorm identifiers.

### Step 4: Add memory or context
- Persist per-patient timezone, quiet hours, caregiver contacts (consented).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional “care navigator” agent that only **summarizes** adherence for staff from stored metrics—no autonomous med changes.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Missed-dose detection vs pillbox ground truth in pilots; false “missed” rate from flaky devices.
- **Latency:** Time from expected window end to reminder/escalation fired.
- **Cost:** SMS/voice spend per thousand patients; workflow compute.
- **User satisfaction:** Opt-out rate, self-reported burden scales.
- **Failure rate:** Duplicate notifications, wrong-patient linkage, timezone bugs.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** N/A for core path; if LLM copy is used, it must not invent dosing instructions—template-only outputs.
- **Tool failures:** SMS undelivered, carrier filtering; mitigated with DLQ, alternate channel, and capped retries.
- **Latency issues:** Backlogged pharmacy files; mitigated with streaming parsers and lag SLO alerts.
- **Cost spikes:** Runaway reminders from bad schedules; mitigated with global rate limits and anomaly detection.
- **Incorrect decisions:** Linking events to wrong patient; mitigated with strict identity reconciliation and human review queue for ambiguous merges.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log delivery IDs and schedule version, not message body PHI where policy forbids.
- **Observability:** Delivery success %, per-clinic lag, device dropout rate, escalation counts.
- **Rate limiting:** Per patient and per clinic; detect misconfigured cron storms.
- **Retry strategies:** Idempotent `event_id` keys; safe replays after partial failures.
- **Guardrails and validation:** Consent store with revocation; pediatric and cognitive-accessibility policies; crisis routing is **out of scope** unless clinically partnered.
- **Security considerations:** HIPAA, encryption at rest, BAAs with vendors, regional residency, break-glass access auditing.

---

## 🚀 Possible Extensions

- **Add UI:** Patient app with simple “took it” UX and education snippets (non-diagnostic).
- **Convert to SaaS:** Multi-tenant adherence platform with per-tenant policy packs.
- **Add multi-agent collaboration:** Optional separate “pharmacy reconciliation” agent with read-only tools (governed).
- **Add real-time capabilities:** Live device streams with backpressure.
- **Integrate with external systems:** Epic/Cerner FHIR tasks, Surescripts where licensed.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **reliable scheduling + measurement** before any conversational coaching features.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Durable workflows** for healthcare timing
  - **Consent-aware** messaging
  - **Idempotent** medical event ingestion
  - **System design thinking** for regulated patient communications
