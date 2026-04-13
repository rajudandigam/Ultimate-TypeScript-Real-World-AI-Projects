System Type: Agent  
Complexity: Level 4  
Industry: Enterprise Knowledge  
Capabilities: Knowledge graph, Retrieval  

# Organizational Memory Graph Builder

## 🧠 Overview
Builds a **living knowledge graph** across **documents, Slack/Teams, and mail** (where legally ingested) that links **people, decisions, systems, and customer entities**—powers **contextual retrieval** (“who decided X, when, and why”) with **ACL-aware expansion** and **temporal validity** (reorgs, renamed services). **Distinct** from flat **RAG over chunks**: this project is **graph-first** with **typed edges** and **provenance** on every relationship.

*Catalog note:* Complements **`Enterprise RAG Knowledge Platform (Permission-Aware)`** (doc Q&A). Use this when the product is **entity-centric memory** (orgs, launches, incidents) with **graph traversals** + optional RAG on attached evidence nodes.

---

## 🎯 Problem
Institutional memory lives in chat scrollback; postmortems repeat mistakes; onboarding cannot find “the real owner” of a dependency.

---

## 💡 Why This Matters
- **Pain it removes:** Fragmented truth and slow cross-functional alignment after leadership changes.
- **Who benefits:** Engineering leadership, program management, and sales/solution architects.

---

## 🏗️ System Type
**Chosen:** **Single Agent** for **guided graph expansion** and **query decomposition**; **ETL + entity resolution** are **workflow/batch** systems of record.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-connector ETL, disambiguation, and strict authz.

---

## 🏭 Industry
Enterprise knowledge / collaboration intelligence

---

## 🧩 Capabilities
Knowledge graph, Retrieval, Reasoning, Observability, Automation

---

## 🛠️ Suggested TypeScript Stack
Node.js, Neo4j or Neptune or Postgres+AGE, dbt for staging, Slack/Graph APIs, Microsoft Graph (scoped), OpenSearch for evidence text, OpenAI SDK tool calling, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Organizational Memory Graph Builder** (Agent, L4): prioritize components that match **agent** orchestration and the **enterprise-ai** integration surface.

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
Connectors → **silver layer** (normalized events) → **entity resolver** → **graph upsert jobs** → **Memory Agent** answers path queries + pulls evidence snippets → UI explorer + API for copilots

---

## 🔄 Implementation Steps
1. Docs-only MVP with manual entity tags  
2. Slack thread → decision edge extraction with human QA  
3. Reorg-aware identity mapping (email → workday id)  
4. Customer 360 light (CRM id links) with DLP redaction  
5. “Time travel” graph views as-of date for audits  

---

## 📊 Evaluation
Query success rate on held-out questions, graph precision on labeled edges, connector freshness SLA, user trust in provenance clicks

---

## ⚠️ Failure Scenarios
**Wrong person linked** to a decision; **stale edges** after acquisition; **over-collection** of mail—human confirmation queues for sensitive edges, TTL on inferred links, legal minimization on mail bodies

---

## 🤖 Agent breakdown
- **Graph query planner:** decomposes NL into Cypher/GSQL sub-queries with limits.  
- **Evidence retriever:** fetches text for node ids user can access.  
- **Synthesis agent:** answers with **node/edge citations** only; refuses if subgraph empty.

---

## 🎓 What You Learn
Enterprise graphs at scale, consent-aware ingestion, graph+RAG hybrid patterns
