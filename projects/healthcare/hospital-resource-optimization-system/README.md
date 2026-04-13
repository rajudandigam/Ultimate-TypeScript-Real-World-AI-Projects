System Type: Multi-Agent  
Complexity: Level 5  
Industry: Healthcare  
Capabilities: Optimization, Planning  

# Hospital Resource Optimization System

## 🧠 Overview
**Multi-agent operations** for **bed management**, **staffing**, and **OR scheduling** coordinated by a **supervisor** with **constraint solvers** (MILP/heuristics) and **live ADT feeds**—human command center retains override. **Not** clinical decision support for diagnosis; **capacity** optimization with HIPAA and union rule constraints.

---

## 🎯 Problem
Boarding, cancellations, and OR gaps waste capacity and harm outcomes indirectly.

---

## 🏗️ System Type
**Chosen:** Multi-Agent (bed agent, staffing agent, OR agent + supervisor + solver).

---

## ⚙️ Complexity Level
**Target:** Level 5.

---

## 🏭 Industry
Healthcare / hospital operations.

---

## 🧩 Capabilities
Optimization, Planning, Automation, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Temporal**, **Node.js**, **Postgres**/Timescale, solver service (OR-Tools etc.), HL7/FHIR ADT, **OpenTelemetry**.

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Hospital Resource Optimization System** (Multi-Agent, L5): prioritize components that match **multi** orchestration and the **healthcare** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK (or LangGraph.js)** — shared state + handoffs map cleanly to multi-specialist designs with traceable spans per agent.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
ADT stream → state graph → agents propose moves → solver validates → command center UI → execute bed/OR assignments via hospital APIs where available.

---

## 🔄 Implementation Steps
Dashboards only → rules → optimization → multi-agent suggestions → human-in-loop execution.

---

## 📊 Evaluation
ALOS proxies, boarding hours, OR utilization, staff overtime, nurse satisfaction (pilot).

---

## ⚠️ Challenges & Failure Cases
**Bad transfers**—hard constraints on acuity/Isolation. **Stale census**—reconciliation jobs. **Solver timeouts**—fallback heuristics.

---

## 🏭 Production Considerations
HIPAA, 24/7 on-call, audit of overrides, union contracts encoded as constraints, change management.

---

## 🚀 Possible Extensions
Surge forecasting from ED arrivals, ambulance diversion modeling (policy-heavy).

---

## 🔁 Evolution Path
Reporting → recommend → assisted execute with approvals.

---

## 🎓 What You Learn
Healthcare ops research, constraint modeling, multi-stakeholder agent governance.
