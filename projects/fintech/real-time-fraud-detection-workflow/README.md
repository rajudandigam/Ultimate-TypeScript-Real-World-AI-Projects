System Type: Workflow  
Complexity: Level 2  
Industry: Fintech  
Capabilities: Detection  

# Real-Time Fraud Detection Workflow

## 🧠 Overview
An **event-driven workflow** that scores **card or payment transactions** in milliseconds using **rules + lightweight models**, **branches** to step-up challenges or blocks, and emits **audit-friendly** decisions—keeping **deterministic scoring** as the authority while optional LLMs assist only in **post-hoc analyst narratives**, not inline scoring unless you deliberately graduate complexity.

---

## 🎯 Problem
Fraud is fast; batch reviews are too slow. Teams need **repeatable pipelines** with clear thresholds, **idempotent** handling of duplicate events, and **explainable** flags regulators and customers can interrogate.

---

## 💡 Why This Matters
- **Pain it removes:** Chargebacks, account takeover losses, and opaque “computer says no” moments without appeal data.
- **Who benefits:** Issuers, neobanks, and payment processors modernizing legacy rule stacks.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

Real-time fraud is a **state machine**: ingest → enrich → score → decision → case. LLMs are optional and should not add nondeterministic latency to the hot path at L2.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Rules + velocity checks + simple ML; strong engineering for **latency**, **replay**, and **observability**—not yet full enterprise model governance (L5).

---

## 🏭 Industry
Example:
- Fintech (payments fraud, card authorization, ATO prevention)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — optional (playbooks for analysts, offline)
- Planning — light (case routing steps)
- Reasoning — optional (LLM narrative after decision, not blocking auth)
- Automation — **in scope** (block, step-up SMS, lock card)
- Decision making — **in scope** (rules + score thresholds)
- Observability — **in scope**
- Personalization — light (per-merchant risk profiles)
- Multimodal — rare (device signals, not images on hot path)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **Kafka / Redpanda** or **Kinesis** (event bus)
- **Flink-like** processing optional; start with **partitioned consumers**
- **Redis** (velocity windows, feature cache)
- **Postgres** (cases, decisions, overrides)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Real-Time Fraud Detection Workflow** (Workflow, L2): prioritize components that match **workflow** orchestration and the **fintech** integration surface.

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

- **Input (UI / API / CLI):** Authorization stream, wallet transfers, login risk scores (if integrated).
- **LLM layer:** Optional offline summarization for case management—not required for L2 core.
- **Tools / APIs:** List deny/allow, step-up providers, core banking APIs (gated).
- **Memory (if any):** Short rolling windows for velocity; device fingerprints (privacy reviewed).
- **Output:** Approve/challenge/decline to auth path; case records for review.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Static rules + velocity counters only.

### Step 2: Add AI layer
- Add lightweight classifier model behind same workflow branch with shadow mode.

### Step 3: Add tools
- Integrate step-up vendor and customer notification tools.

### Step 4: Add memory or context
- Add device graph features with strict TTL and legal basis.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional analyst copilot agent separate from auth latency path (future).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Fraud catch rate vs false positive impact (precision at operational FPR).
- **Latency:** p99 decision time vs authorization SLA (often sub-100ms budgets).
- **Cost:** Infra $ per million transactions; model cost if added.
- **User satisfaction:** Legitimate transaction success rate; complaint volume.
- **Failure rate:** Timeouts causing incorrect approves/declines; duplicate decisions.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** N/A on pure rules path; if LLM added wrongly on hot path, it could invent reasons—**do not** do that at L2.
- **Tool failures:** Step-up SMS vendor down; mitigated by fallback path or fail-safe decline policy per risk appetite.
- **Latency issues:** Feature store cold starts; mitigated by local caches and minimal feature sets on hot path.
- **Cost spikes:** Oversized enrichment fan-out; mitigated by sampling and caps.
- **Incorrect decisions:** Bias against demographics or regions; mitigated by fairness testing, override audits, and regular rule reviews.

---

## 🏭 Production Considerations

- **Logging and tracing:** Decision codes, not PAN; immutable audit for overrides.
- **Observability:** FP/FN monitoring, drift detection on features, queue lag, shadow vs live model diff.
- **Rate limiting:** Protect enrichment APIs from storm traffic during incidents.
- **Retry strategies:** Idempotent consumers keyed by `transaction_id`; safe replay from DLQ.
- **Guardrails and validation:** Schema validation on events; kill switches for new rules; canary deployments.
- **Security considerations:** KMS, tamper-evident logs, least privilege to core banking, red-team exercises.

---

## 🚀 Possible Extensions

- **Add UI:** Investigator console with timeline graph.
- **Convert to SaaS:** Multi-tenant rules DSL with simulation.
- **Add multi-agent collaboration:** Separate graph-fraud agent offline (advanced).
- **Add real-time capabilities:** Streaming features from device SDK.
- **Integrate with external systems:** MISP-style intel feeds, case management, chargeback APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **measurement and safety** before ML on the authorization path.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Event-driven** fraud architecture
  - **Latency budgets** and idempotent consumers
  - **Operational** precision/recall tradeoffs
  - **System design thinking** for money movement safety
