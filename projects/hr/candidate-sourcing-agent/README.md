System Type: Agent  
Complexity: Level 3  
Industry: HR  
Capabilities: Retrieval  

# Candidate Sourcing Agent

## 🧠 Overview
Assists recruiters to **discover candidates** by querying **allowlisted** sources (internal CRM, alumni DB, conference lists, **licensed** talent platforms) with **structured search plans**—**no** scraping gated social sites against ToS; outputs are **shortlists with evidence links** and **outreach drafts** requiring **human send**.

---

## 🎯 Problem
Sourcing is manual and inconsistent; copy-paste outreach burns domain reputation and violates platform rules.

---

## 💡 Why This Matters
- **Pain it removes:** Empty pipelines for niche roles, duplicate outreach, and missed warm leads already in CRM.
- **Who benefits:** Technical recruiters and sourcers in competitive hiring markets.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `search_internal_talent_pool`, `search_ats_tags`, `similar_profiles` (embedding), `draft_outreach` (draft-only).

---

## ⚙️ Complexity Level
**Target:** Level 3. Multi-source retrieval + compliance + personalization; L4+ adds multi-agent (research vs writer) with strict boundaries.

---

## 🏭 Industry
HR / recruiting

---

## 🧩 Capabilities
Retrieval, Planning, Reasoning, Automation (draft), Observability, Personalization

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenAI SDK tools, ATS APIs, Postgres/pgvector, LinkedIn-compliant partner APIs only, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Candidate Sourcing Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **hr** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
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
BFF + sourcing agent + connector adapters (internal-first) + audit log + human approval UI for messages.

---

## 🔄 Implementation Steps
(1) Internal-only search MVP (2) LLM summarizes matches (3) Add licensed external APIs (4) Embeddings for similarity (5) Optional multi-agent reviewer for tone/compliance

---

## 📊 Evaluation
Precision of shortlist vs recruiter labels, time-to-shortlist, outreach reply rate, compliance incident count (target 0), cost per search session

---

## ⚠️ Challenges & Failure Cases
Hallucinated employers; ToS-violating automation; PII leakage; biased filters; duplicate contacts spamming; rate limits causing partial results—mitigate with allowlists, human-in-loop send, redaction, dedupe keys, explicit data windows

---

## 🏭 Production Considerations
Audit trails, OAuth scopes, regional labor marketing laws, CAN-SPAM, DSAR deletion, rate limits, anomaly detection on bulk export

---

## 🚀 Possible Extensions
CRM sync, diversity analytics (aggregated), scheduling handoffs to coordinators

---

## 🔁 Evolution Path
Keyword search → enriched profiles → tool-using agent → multi-agent with governance

---

## 🎓 What You Learn
Ethical sourcing, connector design, retrieval quality for people systems
