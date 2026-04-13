System Type: Workflow  
Complexity: Level 2  
Industry: Legal / Compliance  
Capabilities: Extraction  

# Contract Clause Extraction System

## 🧠 Overview
**Pipelines** that ingest **contracts** (PDF/DOCX), run **OCR/layout** where needed, and emit **structured clause records** (termination, liability cap, indemnity, DPAs, SLAs) into a **contract database**—**deterministic parsers + regex/ML classifiers** lead; LLM assists **edge labeling** only with **human QC** for high-risk fields and **full document retention** policies.

---

## 🎯 Problem
Deal desks and procurement cannot query obligations across thousands of files; manual abstraction is slow and inconsistent.

---

## 💡 Why This Matters
- **Pain it removes:** Missed renewal windows, unclear liability caps in vendor reviews, and slow due diligence.
- **Who benefits:** Legal ops, procurement, and revenue teams managing vendor and customer paper.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Ingest → parse → extract → validate → publish is a **batch/stream pipeline** with review queues.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Extraction + validation + UI review; L3+ adds cross-contract obligation search with embeddings and clause-level lineage.

---

## 🏭 Industry
Example:
- Legal / contract lifecycle management (CLM)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — clause taxonomy definitions, playbooks
- Planning — bounded (review routing by clause type)
- Reasoning — optional LLM for ambiguous spans (QC gated)
- Automation — **in scope** (ingest, OCR, classification)
- Decision making — bounded (confidence thresholds for auto-accept)
- Observability — **in scope**
- Personalization — per-company clause ontology
- Multimodal — PDF layout + scanned images

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** orchestrator
- **pdf.js** / **Apache Tika** / vendor OCR
- **Postgres** JSONB for clauses + **OpenSearch** for keyword search
- **OpenAI SDK** for optional span labeling with citations
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Contract Clause Extraction System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **legal** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- E-signature provider APIs (DocuSign, Dropbox Sign)
- DMS / CMS search APIs
- Court / filing portals only where licensed

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

- **Input (UI / API / CLI):** CLM webhook, bulk S3 upload, email gateway (careful).
- **LLM layer:** Optional field fill for low-confidence spans with `page_bbox` citations.
- **Tools / APIs:** DMS/CLM APIs, e-signature vendor metadata pulls.
- **Memory (if any):** Versioned clause graph per agreement id.
- **Output:** Search index + API for downstream risk dashboards.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template extraction for your house MSAs only.

### Step 2: Add AI layer
- LLM proposes labels for unknown paragraphs with page references.

### Step 3: Add tools
- Human QC UI with accept/reject metrics feeding an active learning loop.

### Step 4: Add memory or context
- Clause synonym dictionaries per jurisdiction.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional reviewer agent separate from extractor to reduce confirmation bias.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Field-level precision/recall vs attorney-labeled gold set.
- **Latency:** Pages processed per hour per worker pool.
- **Cost:** OCR + LLM $ per 100-page agreement.
- **User satisfaction:** Time saved in vendor review meetings.
- **Failure rate:** Wrong liability numbers, dropped exhibits, PII over-exposure.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Wrong cap amounts; require numeric extraction validated against regex + checksum human for high $.
- **Tool failures:** OCR garbage; route to manual QC instead of guessing.
- **Latency issues:** Huge ZIP uploads; streaming unzip and per-file workflows.
- **Cost spikes:** Re-OCR entire corpus; content-hash dedupe and incremental processing.
- **Incorrect decisions:** Auto-export to third parties with sensitive clauses; export redaction pipeline.

---

## 🏭 Production Considerations

- **Logging and tracing:** Clause ids, model versions, QC actor ids—minimize raw text in logs.
- **Observability:** QC backlog, confidence histograms, parser crash rates.
- **Rate limiting:** Per-tenant ingest; virus scan stage mandatory.
- **Retry strategies:** Idempotent file keys; safe partial writes with transaction boundaries.
- **Guardrails and validation:** Attorney-client privilege flags; legal hold prevents deletion.
- **Security considerations:** Encryption at rest, KMS, CMEK options, strict RBAC, audit exports for regulators.

---

## 🚀 Possible Extensions

- **Add UI:** Clause heatmap across portfolio (renewal dates, caps).
- **Convert to SaaS:** CLM extraction API with tenant ontologies.
- **Add multi-agent collaboration:** “Risk flags” agent vs “definitions” agent merge.
- **Add real-time capabilities:** Near-real-time updates when e-sign completes.
- **Integrate with external systems:** Ironclad, DocuSign CLM, Salesforce CPQ.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **QC + numeric validation** before portfolio-wide trust.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Document AI** pipelines for contracts
  - **Human QC** loops and active learning
  - **Privilege and retention** engineering
  - **System design thinking** for legal ops platforms
