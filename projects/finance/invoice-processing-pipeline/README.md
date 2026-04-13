System Type: Workflow  
Complexity: Level 3  
Industry: Finance  
Capabilities: Extraction, Classification  

# Invoice Processing Pipeline

## 🧠 Overview
A **batch-oriented workflow** that ingests invoices (PDF, email, EDI), **extracts** structured line items and tax fields, **classifies** spend categories against your chart of accounts, and **validates** totals and vendor identity before posting to downstream ERP—treating the LLM as one **stage** in a governed pipeline, not the system of record.

---

## 🎯 Problem
Finance teams drown in unstructured invoices: OCR noise, inconsistent vendor names, split tax lines, and duplicate submissions. Pure OCR rules miss layout variance; pure LLM extraction is non-auditable. Production systems need **deterministic validation**, **exceptions queues**, and **replay** from raw artifacts.

---

## 💡 Why This Matters
- **Pain it removes:** Manual keying, month-end crunch, and posting errors that are expensive to unwind.
- **Who benefits:** AP departments, SMB finance ops, and B2B marketplaces handling high inbound invoice volume.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** AI Workflow

Invoice handling maps to **stages with contracts** (receive → extract → validate → post). LLM or vision steps slot into specific nodes with schemas, confidence scores, and human exception paths—matching how regulated finance processes actually ship.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Reliability comes from **classification** models plus **validation rules** (VAT math, PO match, duplicate detection) and optional retrieval of vendor-specific conventions—not from open-ended dialogue.

---

## 🏭 Industry
Example:
- Finance (accounts payable, invoice automation, ERP ingestion)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (vendor playbooks, historical corrections)
- Planning — light (batch prioritization by due date)
- Reasoning — bounded (explain exception reasons)
- Automation — **in scope** (ERP draft posting)
- Decision making — bounded (route to human vs auto-post within policy)
- Observability — **in scope**
- Personalization — optional (per-entity GL defaults)
- Multimodal — **in scope** (PDF/scan layout)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Temporal** / **BullMQ** (durable pipelines, retries)
- **OpenAI SDK** (structured extraction; vision for PDFs where allowed)
- **AWS Textract** / **Google Document AI** (optional OCR baseline)
- **Postgres** (invoice records, line items, audit)
- **ERP adapters** (NetSuite, Xero, SAP BTP APIs—choose what your org uses)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Invoice Processing Pipeline** (Workflow, L3): prioritize components that match **workflow** orchestration and the **finance** integration surface.

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

- **Input (UI / API / CLI):** Email ingestion, SFTP drop, supplier portal upload, EDI gateway.
- **LLM layer:** Extraction/classification nodes producing JSON aligned to your canonical invoice schema.
- **Tools / APIs:** Vendor master lookup, PO matching service, FX rate table, ERP draft post APIs.
- **Memory (if any):** Retrieval of prior corrections for similar vendor layouts; few-shot examples versioned per tenant.
- **Output:** Validated posting batch + exception queue with reason codes.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- OCR + template parsers for top vendors; manual review UI only.

### Step 2: Add AI layer
- LLM fills missing fields where templates abstain; strict schema validation.

### Step 3: Add tools
- Vendor lookup, PO lines fetch, tax validation tool, duplicate invoice search.

### Step 4: Add memory or context
- Store labeled corrections; retrieve similar invoices for layout hints.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional agentic **exception handler** for analyst UI; posting remains workflow-gated.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Field-level accuracy vs human review; duplicate catch rate; VAT balance errors.
- **Latency:** Throughput invoices/hour per worker; p95 time to ready-to-post.
- **Cost:** OCR + LLM cost per invoice at target quality.
- **User satisfaction:** AP time saved, dispute rate from vendors.
- **Failure rate:** Posting rejects, ERP API errors, stuck workflows.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented invoice numbers or tax rates; mitigated by cross-field arithmetic checks and reference lookups.
- **Tool failures:** ERP downtime; mitigated by outbox pattern and replayable batches.
- **Latency issues:** Large multi-page PDFs; mitigated by page-level parallelism and timeouts per stage.
- **Cost spikes:** Vision on every page blindly; mitigated by layout classifier routing cheap vs expensive paths.
- **Incorrect decisions:** Paying fraudulent invoices; mitigated by vendor verification, bank detail change flags, and dual control for high amounts.

---

## 🏭 Production Considerations

- **Logging and tracing:** Immutable audit of model version, ruleset version, and extracted JSON hashes; restrict PII in logs.
- **Observability:** Exception queue depth, auto-post vs manual ratio, stage latency heatmaps.
- **Rate limiting:** Per supplier and per tenant on LLM/OCR calls.
- **Retry strategies:** Idempotent ingestion keys; poison document quarantine.
- **Guardrails and validation:** Double-entry checks, amount caps for auto-post, sanctions screening integration where required.
- **Security considerations:** Encryption at rest, least-privilege ERP tokens, SOC2 evidence, regional residency.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side PDF + extracted fields with keyboard-first review.
- **Convert to SaaS:** Multi-tenant with per-country tax packs.
- **Add multi-agent collaboration:** Rare—prefer separate **fraud rules engine** over LLM agents.
- **Add real-time capabilities:** Near-real-time email ingestion with streaming extraction updates.
- **Integrate with external systems:** Procurement suites, three-way match with GRNs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Keep posting conservative; use AI to reduce touch time, not to eliminate controls.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Document AI** pipelines with validation gates
  - **Financial controls** as engineering requirements
  - **Idempotent** batch processing and replay
  - **System design thinking** for auditable automation
