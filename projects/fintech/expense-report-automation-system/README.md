System Type: Workflow  
Complexity: Level 2  
Industry: Fintech  
Capabilities: Automation  

# Expense Report Automation System

## 🧠 Overview
A **workflow pipeline** that ingests **receipts** (email, mobile camera, card feed), extracts **line items** via OCR + parsers, **categorizes** spend against a **GL / policy taxonomy**, and assembles **approval-ready reports**—with explicit **human review** steps for ambiguous merchants and out-of-policy flags.

---

## 🎯 Problem
Employees hate expense reports; finance teams chase receipts. Spreadsheets and ad hoc Slack photos do not scale. You need **repeatable extraction**, **policy rules**, and **audit trails** more than a clever chatbot.

---

## 💡 Why This Matters
- **Pain it removes:** Lost receipts, miscategorized spend, month-end close delays.
- **Who benefits:** SMBs through mid-market companies using modern spend tools.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

Expense automation is **DAG-shaped**: ingest → OCR → classify → match card txn → policy check → manager approve → ERP export. Optional LLM improves **classification** when rules are insufficient.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. OCR + rules + simple ML/LLM assist; focus on **reliability** and **integrations** before deep personalization (L3+).

---

## 🏭 Industry
Example:
- Fintech (spend management, T&E automation, SMB bookkeeping)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (policy FAQ for employees)
- Planning — light (batch close schedules)
- Reasoning — optional (LLM explains policy flag from rule codes)
- Automation — **in scope** (routing, reminders, ERP export)
- Decision making — bounded (suggest category; human/manager for disputes)
- Observability — **in scope**
- Personalization — light (per-department defaults)
- Multimodal — **in scope** (receipt images → OCR)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Inngest** / **Temporal** (report lifecycle)
- **S3** + **KMS** for receipt storage
- **Textract** / **Document AI** / open-source OCR
- **Postgres** (reports, line items, audit)
- **NetSuite / QuickBooks / Xero** connectors
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Mobile capture, email ingestion mailbox, corporate card webhooks.
- **LLM layer:** Optional classifier for merchant text when rules tie-break.
- **Tools / APIs:** ERP export, payroll dimensions, mileage calculators.
- **Memory (if any):** Per-user merchant memoization (e.g., “Uber → Ground transport”).
- **Output:** Submitted report PDF, journal entries, approval notifications.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Manual line entry + photo attach; no AI.

### Step 2: Add AI layer
- LLM proposes category from enumerated list only; low confidence → review queue.

### Step 3: Add tools
- Add card transaction matching tool with amount/date tolerance rules.

### Step 4: Add memory or context
- Learn merchant→category mappings per org with admin override.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional chat agent for employees asking “is this reimbursable?” reading policy KB (separate workflow).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Category accuracy vs labeled receipts; duplicate detection precision.
- **Latency:** Time from upload to ready-to-submit draft.
- **Cost:** OCR + LLM $ per receipt at volume.
- **User satisfaction:** Time to submit, finance review hours saved.
- **Failure rate:** Wrong GL coding, tax issues, missing VAT fields for EU.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented line items; mitigated by OCR JSON validation and totals reconciliation.
- **Tool failures:** ERP API downtime during export; mitigated by outbox pattern and retries.
- **Latency issues:** Large multi-page PDFs; mitigated by chunk OCR and parallel pages.
- **Cost spikes:** Re-OCR unchanged receipts; mitigated by content hashing.
- **Incorrect decisions:** Policy violations auto-approved; mitigated by dual approval for high amounts, MCC blocks, alcohol/geo rules as code.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit of category changes; minimize PII in model logs.
- **Observability:** OCR confidence histogram, queue depths, export success rates, fraud patterns (duplicate receipts).
- **Rate limiting:** Email ingestion loops; per-user upload caps.
- **Retry strategies:** At-least-once exports with idempotency keys to ERP.
- **Guardrails and validation:** Receipt tamper checks (basic), VAT regex per country, manager segregation of duties.
- **Security considerations:** Encryption, access control by org, retention policies, SOC2.

---

## 🚀 Possible Extensions

- **Add UI:** Split expenses across projects with drag-drop receipt regions.
- **Convert to SaaS:** Multi-tenant with per-org policy packs.
- **Add multi-agent collaboration:** Separate VAT specialist for EU (optional).
- **Add real-time capabilities:** Live spend vs per-diem caps during travel.
- **Integrate with external systems:** Slack approvals, HR org charts, travel booking tools.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **accounting correctness** before expanding conversational scope.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **OCR reconciliation** (subtotals, tax, tips)
  - **ERP integration** idempotency
  - **Policy-as-rules** for reimbursements
  - **System design thinking** for finance operations
