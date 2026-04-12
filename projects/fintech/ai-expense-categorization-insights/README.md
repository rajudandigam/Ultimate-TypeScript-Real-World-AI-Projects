System Type: Workflow → Agent  
Complexity: Level 3  
Industry: Fintech  
Capabilities: Classification, Retrieval, Personalization  

# AI Expense Categorization + Insights

## 🧠 Overview
A system that starts as a **deterministic-first workflow** for ingesting transactions and receipts, then adds an **agent** for ambiguous cases and **personalized** insights (policy drift, duplicate spend, vendor anomalies)—always anchoring suggestions to **ledger facts** and retrieved policy text.

---

## 🎯 Problem
Expense pipelines break when categorization is purely manual (slow) or purely LLM (non-auditable). Finance teams need **GL mapping** consistency, VAT handling, and controls that survive audits—while still catching patterns humans miss.

---

## 💡 Why This Matters
- **Pain it removes:** Month-end rework, miscoded spend, and “surprise” budget lines that should have been flagged earlier.
- **Who benefits:** SMB finance ops, corporate card programs, and spend-management products integrating with accounting systems.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow → Agent

High-volume categorization should be **workflow-orchestrated** (idempotent, replayable, batch SLAs). An **agent** belongs at the **edges**: low-confidence rows, novel merchants, and natural-language “why was this denied?” explanations—never as the sole source of truth for postings.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Personalization and policy retrieval are the lift from rules to **context-aware** classification; anomaly insight benefits from **memory** of user/org corrections.

---

## 🏭 Industry
Example:
- Fintech (spend management, corporate cards, SMB bookkeeping integrations)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (policy PDFs, GL mapping tables, per-merchant notes)
- Planning — light (month-end review plans)
- Reasoning — bounded (explain denials and anomalies)
- Automation — **in scope** (posting proposals, not silent GL writes without policy)
- Decision making — **in scope** (confidence thresholds, human queues)
- Observability — **in scope**
- Personalization — **in scope** (per-employee merchant habits)
- Multimodal — optional (receipt OCR pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** / **BullMQ** (batch ingestion, scheduled insight jobs)
- **OpenAI SDK** (structured classification schemas)
- **Plaid / Stripe / card issuer files** (as available to your product)
- **Postgres** (double-entry staging, audit, embeddings metadata)
- **pgvector** or managed retrieval for policy chunks
- **QuickBooks / Xero / NetSuite** APIs (export adapters)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** CSV/card feed webhooks, receipt upload API, accountant review UI.
- **LLM layer:** Classifier for ambiguous rows; insight agent for monthly digest grounded in aggregates.
- **Tools / APIs:** Merchant enrichment APIs, FX rate tables, accounting export tools (write behind approval).
- **Memory (if any):** User corrections as supervised signals; embeddings over policy documents with version pins.
- **Output:** Categorized ledger lines with `confidence`, `rationale`, `policy_citation`, and anomaly flags.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rules engine + merchant dictionary; export to accounting with manual review queue.

### Step 2: Add AI layer
- LLM fills missing memo fields and suggests categories when rules abstain.

### Step 3: Add tools
- Tools to fetch vendor master data, prior transactions for same merchant, and department budgets.

### Step 4: Add memory or context
- Learn from approved corrections; retrieve policy clauses relevant to flagged merchants.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional: separate **policy compliance** agent with read-only tools if regulators require stricter separation—usually overkill until Level 4+.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Category accuracy vs accountant labels; drift after policy updates.
- **Latency:** Batch throughput and time-to-review for queues.
- **Cost:** LLM cost per 1k transactions after rule short-circuiting.
- **User satisfaction:** Accountant time saved, dispute rate from employees.
- **Failure rate:** Incorrect GL posts prevented at validation, duplicate exports, tool timeouts.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented tax codes; mitigated by allowlists and schema validation tied to chart of accounts.
- **Tool failures:** Enrichment API gaps; mitigated by fallback to “unknown vendor” path and manual enrichment.
- **Latency issues:** Large month-end batches; mitigated by autoscaling workers and prioritization by amount.
- **Cost spikes:** OCR+LLM on every receipt line; mitigated by tiered processing and caching OCR text.
- **Incorrect decisions:** Silent mis-posting; mitigated by **no auto-post** above risk threshold without second approval.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit of model version, policy version, and evidence for each posting proposal.
- **Observability:** Dashboards for queue depth, confidence histograms, anomaly precision.
- **Rate limiting:** Per tenant on enrichment and LLM calls.
- **Retry strategies:** Idempotent ingestion keys; replay-safe exports to accounting systems.
- **Guardrails and validation:** Double-entry invariant checks; PII minimization in logs; segregation of duties for exports.
- **Security considerations:** Encryption at rest, key management for banking aggregators, regional data residency, fraud monitoring on agent tool usage.

---

## 🚀 Possible Extensions

- **Add UI:** Accountant workbench with side-by-side policy citations.
- **Convert to SaaS:** Multi-tenant policy packs and connector marketplace.
- **Add multi-agent collaboration:** Compliance reviewer agent for regulated industries.
- **Add real-time capabilities:** Near-real-time card auth categorization hints.
- **Integrate with external systems:** ERP sync, Slack approvals, travel booking linkage.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep postings conservative; let intelligence reduce human load without reducing auditability.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Financial-grade** validation patterns in AI pipelines
  - **RAG** for internal policy without leaking across tenants
  - **Human-in-the-loop** queues that scale
  - **System design thinking** for auditable automation
