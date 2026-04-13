System Type: Workflow  
Complexity: Level 2  
Industry: HR  
Capabilities: Automation  

# Employee Onboarding Automation System

## 🧠 Overview
**Durable workflows** orchestrate **Day-1 tasks**: accounts, hardware, trainings, policy acknowledgements, and **buddy/manager nudges**—with **SLA timers**, **HRIS/ITSM integrations**, and optional **LLM-generated personalized copy** only from **approved templates** and **HRIS facts** (start date, role, location).

---

## 🎯 Problem
New hires stall in limbo between IT, HR, and managers; checklists in spreadsheets are forgotten under load.

---

## 💡 Why This Matters
- **Pain it removes:** Bad first-week experience, compliance gaps on trainings, and ops toil.
- **Who benefits:** People ops and IT in growing companies.

---

## 🏗️ System Type
**Chosen:** Workflow (workflow-first). LLM optional for messaging only.

---

## ⚙️ Complexity Level
**Target:** Level 2. Integrations + reminders + forms; L3+ adds intelligent dependency resolution across global entities.

---

## 🏭 Industry
HR / people operations

---

## 🧩 Capabilities
Automation, Planning, Observability, Personalization (bounded)

---

## 🛠️ Suggested TypeScript Stack
Temporal/Inngest, Node.js, Workday/BambooHR APIs, Okta/Google Workspace, Jira/ServiceNow, Postgres, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Employee Onboarding Automation System** (Workflow, L2): prioritize components that match **workflow** orchestration and the **hr** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Workday / BambooHR / Greenhouse-style APIs (pick what your org uses)
- Slack / Teams
- Google Drive / SharePoint for doc sources

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
Onboarding controller → per-hire workflow instance → task steps with compensations → notifications → completion proofs in audit store

---

## 🔄 Implementation Steps
Static checklist → HRIS-triggered workflows → IT provisioning hooks → training LMS APIs → optional LLM welcome emails from template slots

---

## 📊 Evaluation
Time-to-ready (accounts+device), training completion % before day 14, ticket volume to HR, new hire survey NPS

---

## ⚠️ Challenges & Failure Cases
Wrong start date propagation; missed hardware stock; access before background check cleared; LLM leaking manager notes; workflow stuck without escalation—use idempotency, stock checks, policy gates, template-only LLM, watchdog timers

---

## 🏭 Production Considerations
PII minimization, least-privilege API keys to IT systems, SOC2 logging, regional employment law variations, break-glass manual overrides

---

## 🚀 Possible Extensions
Manager dashboard, offboarding mirror workflow, contractor-specific tracks

---

## 🔁 Evolution Path
Checklists → integrated workflows → personalized comms → optional agent assists

---

## 🎓 What You Learn
Cross-functional orchestration, HRIS/IT identity join patterns, employee journey reliability
