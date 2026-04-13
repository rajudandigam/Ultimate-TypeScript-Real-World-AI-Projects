System Type: Agent  
Complexity: Level 3  
Industry: Healthcare  
Capabilities: Matching, Retrieval  

# Clinical Trial Matching Agent

## 🧠 Overview
Matches **structured eligibility criteria** (from ClinicalTrials.gov-style JSON or sponsor systems) to **patient profiles** with explicit **exclusion logic** executed in code; the **agent explains** why a trial fits or fails with **citations to criteria lines**—**not** enrollment authority; clinicians decide.

---

## 🎯 Problem
Patients and sites miss relevant trials buried in text. Need **transparent** boolean + NLP hybrid over **authoritative** trial records.

---

## 🏗️ System Type
**Chosen:** Single Agent (tool-using): `search_trials`, `evaluate_eligibility_rule`, `fetch_pi_contact`.

---

## ⚙️ Complexity Level
**Target:** Level 3.

---

## 🏭 Industry
Healthcare / oncology ops / patient navigation.

---

## 🧩 Capabilities
Matching, Retrieval, Reasoning, Observability.

---

## 🛠️ Suggested TypeScript Stack
**Node.js**, **Postgres**/OpenSearch index of trials, **OpenAI SDK**, FHIR for patient summary (consent).

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Clinical Trial Matching Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **healthcare** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo.
- **Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it.
- **Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Patient summary (minimized) → agent → trial search → rule engine results → explainable UI.

---

## 🔄 Implementation Steps
Keyword search → structured criteria parser → rule engine → LLM explanations only from engine JSON.

---

## 📊 Evaluation
Precision of “eligible” suggestions vs chart review sample; false hope rate (critical).

---

## ⚠️ Challenges & Failure Cases
**Outdated** trial status—refresh cadence. **PHI** in prompts—minimize. **Hallucinated** arms—tool-only trial facts.

---

## 🏭 Production Considerations
HIPAA, consent, IRB considerations for outreach, audit, bias across demographics (monitor).

---

## 🚀 Possible Extensions
Site feasibility scoring, referral workflow, multilingual criteria.

---

## 🔁 Evolution Path
Search → rules → agent explain → optional site-specific overrides.

---

## 🎓 What You Learn
Eligibility modeling, evidence-linked patient comms, clinical ops ethics.
