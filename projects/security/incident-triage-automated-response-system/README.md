System Type: Multi-Agent  
Complexity: Level 4  
Industry: Security  
Capabilities: Orchestration  

# Incident Triage & Automated Response System

## 🧠 Overview
A **multi-agent SOC copilot** that **classifies incidents**, **gathers evidence** across tools (EDR, IAM, cloud audit), proposes **containment steps**, and **executes approved playbooks** inside **policy sandboxes**—human **approve/deny** gates for destructive actions.

*Catalog note:* Complements **`Multi-Agent Incident Response System`** under DevOps by centering **security operations**, **evidence chains**, and **regulated response** patterns.

---

## 🎯 Problem
Incidents arrive faster than tier-1 can enrich; runbooks drift; automation without governance creates **blast radius**.

---

## 💡 Why This Matters
- **Pain it removes:** Context switching across consoles and inconsistent containment.
- **Who benefits:** SOC tiers, IR retainers, and CISO programs measuring response quality.

---

## 🏗️ System Type
**Chosen:** **Multi-Agent System** — **Triage**, **Forensics**, and **Responder** agents coordinate via a **supervisor** with **immutable audit logs**.

---

## ⚙️ Complexity Level
**Target:** Level 4 — tool-rich orchestration with graded autonomy.

---

## 🏭 Industry
Security operations / incident response

---

## 🧩 Capabilities
Orchestration, Automation, Decision making, Retrieval, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI Agents SDK / Mastra, SOAR APIs (Splunk Phantom, Torq, custom), cloud CLIs behind service accounts, Vault for secrets, Postgres case DB, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Incident Triage & Automated Response System** (Multi-Agent, L4): prioritize components that match **multi** orchestration and the **security** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- SIEM ingestion (Splunk HEC, Elastic, Datadog Logs)
- IdP / SCIM (Okta, Entra) for RBAC
- Cloud audit / CSP APIs for posture

### Open Source Building Blocks
- **OpenAI Agents SDK** — handoffs, parallel tool runs, tracing hooks; good default for multi-role TypeScript services.
- **LangGraph.js** — when you need explicit graph state, conditional edges, or non-OpenAI models in the same orchestration.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Node service + OpenAI Agents SDK + Postgres state store + Redis queue for async specialist work + OTel traces — fits handoff-heavy blueprints.
- **Lightweight:** Single Node process + in-memory queue for demos; still use Zod schemas and one Postgres schema for trip/issue graph state.
- **Production-heavy:** LangGraph for explicit graph control + dedicated worker pool per agent family + strict RBAC on tools + eval harness in CI.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Alert ingest → normalize → **Triage Agent** (severity, dupe) → **Forensics Agent** (queries) → **Responder Agent** (draft actions) → human approval UI → execution worker with lease locks

---

## 🔄 Implementation Steps
1. Read-only enrichment only  
2. Soft actions (disable API key) with dual control  
3. Network isolation playbooks per cloud  
4. Post-incident timeline export (PDF/JSON)  
5. Simulations against synthetic alerts  

---

## 📊 Evaluation
Time-to-first-evidence, false containment rate, playbook success %, analyst satisfaction, audit pass rate

---

## ⚠️ Challenges & Failure Cases
**Over-automation** locks out admins; hallucinated commands; tool latency causes stale decisions—command dry-run, mandatory MFA on execution, TTL on isolations, rollback recipes

---

## 🏭 Production Considerations
Least-privilege service accounts, break-glass accounts, jurisdiction of data access, evidence retention, on-call paging budgets

---

## 🚀 Possible Extensions
Purple-team “fire drill” mode with synthetic attacks to regression-test agents

---

## 🔁 Evolution Path
Static runbooks → supervised agents → policy-graded autonomy with continuous evaluation

---

## 🎓 What You Learn
SOAR design, safe automation, multi-agent governance in high-stakes ops
