System Type: Workflow  
Complexity: Level 2  
Industry: Customer Support  
Capabilities: Generation  

# Knowledge Base Auto-Curation System

## 🧠 Overview
**Workflows** that turn **resolved tickets** into **draft KB articles** with **title/outline/body**, **linked macros**, and **review queues**—deterministic templates extract **steps and error codes**; optional LLM **polishes prose** under **style constraints**. Nothing publishes without **human approval** and **link check** validation.

---

## 🎯 Problem
Support teams solve the same issues repeatedly because documentation lags; manual KB writing is slow and inconsistent.

---

## 💡 Why This Matters
- **Pain it removes:** Stale help centers, contradictory articles, and slow onboarding for new agents.
- **Who benefits:** CX ops, technical writers, and customers self-serving on web portals.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow (workflow-first)

Resolutions → extract → draft → review → publish is a **pipeline** with SLAs and audit.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Extraction + templating + review UI; L3+ adds dedupe against existing articles via embeddings and multi-language generation.

---

## 🏭 Industry
Example:
- Customer support / technical communications

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — similar existing articles for dedupe
- Planning — bounded (article outline)
- Reasoning — optional clarity pass
- Automation — **in scope** (draft creation)
- Decision making — bounded (publish/no-publish gates)
- Observability — **in scope**
- Personalization — per-product doc templates
- Multimodal — optional screenshots sanitized from tickets

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Temporal** / **Inngest** for review SLAs
- **Node.js + TypeScript** workers
- **OpenAI SDK** for drafting under schema
- **CMS/KB API** (Notion, Git-based docs, Zendesk Guide)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Knowledge Base Auto-Curation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **support** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Gmail / Microsoft Graph mail & calendar
- Slack / Teams webhooks & bot APIs
- Notion / Jira / Linear REST

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

- **Input (UI / API / CLI):** Ticket resolved events, labels marking “kb-candidate”.
- **LLM layer:** Draft generator with strict section schema + disclaimers.
- **Tools / APIs:** Ticket fetch, link validator, image scrubber, CMS publish API.
- **Memory (if any):** Dedupe index of article embeddings.
- **Output:** Draft records + reviewer assignments.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Copy-paste template from ticket fields only.

### Step 2: Add AI layer
- LLM rewrites steps for clarity with forbidden-phrase list.

### Step 3: Add tools
- Auto-check links and command snippets against allowlist.

### Step 4: Add memory or context
- Retrieve nearest KB articles to merge duplicates instead of forking.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional editor agent vs fact-checker agent with merge rules.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Defect rate on published articles (reopened tickets citing doc wrong).
- **Latency:** Time from resolution to draft ready for review.
- **Cost:** LLM $ per draft; reviewer minutes saved vs fully manual.
- **User satisfaction:** Self-serve deflection rate; CSAT on help articles.
- **Failure rate:** PII leakage, unsafe commands, broken screenshots.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented menu paths; require citations to ticket/tool-grounded facts.
- **Tool failures:** CMS API errors; keep draft queued with retry.
- **Latency issues:** Huge threads; summarize with chunking before draft.
- **Cost spikes:** Auto-run on every ticket; strict candidate filters.
- **Incorrect decisions:** Publishing secrets or customer-specific data; redaction pipeline mandatory.

---

## 🏭 Production Considerations

- **Logging and tracing:** Draft ids, reviewer actions, publish versions.
- **Observability:** Review backlog age, rejection reasons taxonomy, deflection metrics.
- **Rate limiting:** Per-brand draft creation; detect abusive exfil via ticket text.
- **Retry strategies:** Idempotent publish with content hashes.
- **Guardrails and validation:** Legal disclaimers for regulated products; versioned rollback.
- **Security considerations:** PII scrubbing, RBAC for drafts, audit for public URL changes.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side ticket vs article with highlight mapping.
- **Convert to SaaS:** KB autopilot for MSPs.
- **Add multi-agent collaboration:** Translator + accessibility checker chain.
- **Add real-time capabilities:** Suggest KB insert links to agents during live chat.
- **Integrate with external systems:** Algolia DocSearch, Salesforce Knowledge.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **review + redaction** quality before auto-publish pilots.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Ticket-to-doc** pipelines
  - **Human-in-the-loop** publishing
  - **Dedupe** with embeddings
  - **System design thinking** for self-serve support content
