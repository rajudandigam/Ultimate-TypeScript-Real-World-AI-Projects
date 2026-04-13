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



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Expense Report Automation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **fintech** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Stripe / payment processor APIs
- Plaid or bank aggregation (if permitted)
- Core ledger / accounting webhooks

### Open Source Building Blocks
- **n8n** — fast integration fabric when the blueprint is connector-heavy and ops wants visibility.
- **Temporal + TypeScript SDK** — when you need durable timers, saga compensation, and strict replay semantics.
- **BullMQ + Redis** — lighter option for queue-backed steps without full Temporal yet.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node worker + Postgres + Redis + Temporal (or n8n if integrations dominate) — auditable steps and retries match workflow-first designs.
- **Lightweight:** Hono + BullMQ + Postgres — ship a weekend MVP with cron + queue, migrate to Temporal when sleeps and compensations hurt.
- **Production-heavy:** Temporal Cloud + OTel + separate ingest workers + multi-region Postgres (read replicas) when SLAs and replay volume demand it.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

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
