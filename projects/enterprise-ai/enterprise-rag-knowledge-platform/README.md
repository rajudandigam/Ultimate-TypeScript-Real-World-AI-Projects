System Type: Agent  
Complexity: Level 4  
Industry: Enterprise AI  
Capabilities: Retrieval  

# Enterprise RAG Knowledge Platform (Permission-Aware)

## 🧠 Overview
An **enterprise knowledge platform** that **ingests** Confluence, SharePoint, Google Drive, Slack exports, and **tickets**, then serves a **permission-aware retrieval agent** that **never returns chunks the user cannot access**—enforced via **document ACL snapshots** joined at **query time**, not just at index time.

---

## 🎯 Problem
Classic RAG leaks snippets when ACLs drift; connectors are brittle; answers lack citations tied to authorized sources.

---

## 💡 Why This Matters
- **Pain it removes:** Shadow IT knowledge silos and risky “copy everything to one bucket” shortcuts.
- **Who benefits:** IT, legal, and employees who need trustworthy internal answers.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **retrieval tools** backed by **hybrid search** + **ACL filter** pushed down to the index layer.

---

## ⚙️ Complexity Level
**Target:** Level 4 — multi-tenant ACLs, connector reliability, and evaluation at org scale.

---

## 🏭 Industry
Enterprise knowledge / compliance-heavy sectors

---

## 🧩 Capabilities
Retrieval, Reasoning, Observability, Personalization (per-role), Automation (optional sync)

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenSearch/Elasticsearch w/ document-level security, Postgres for ACL graphs, Temporal connectors, OpenAI SDK, OCR pipeline for PDFs, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Enterprise RAG Knowledge Platform (Permission-Aware)** (Agent, L4): prioritize components that match **agent** orchestration and the **enterprise-ai** integration surface.

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
Connectors → normalization → ACL indexer → vector + BM25 index → **RAG Agent** (tools: search, fetch_doc) → answer w/ citations → feedback loop

---

## 🔄 Implementation Steps
1. Single source (e.g., Drive) with live permission checks  
2. Add hybrid retrieval + reranker  
3. HR/legal sensitivity tags on collections  
4. Continuous ACL diff sync  
5. Red-team tests for horizontal privilege escalation  

---

## 📊 Evaluation
**Authz test suite** pass rate, nDCG on internal benchmarks, citation accuracy, connector freshness SLAs

---

## ⚠️ Challenges & Failure Cases
Stale group memberships; **over-broad SharePoint inheritance**; OCR mangling tables—live IDP lookups for sensitive fetches, table-aware parsers, explicit “insufficient permission” responses vs silence

---

## 🏭 Production Considerations
Data residency, DLP scanning at ingest, retention policies, SIEM logging of queries, BYOK encryption

---

## 🚀 Possible Extensions
Project-scoped “temporary shares” for cross-vendor deals with auto-expiry

---

## 🔁 Evolution Path
Dump-and-index → ACL-aware search → agent answers → continuous trusted knowledge ops

---

## 🎓 What You Learn
Authz-aware retrieval, connector engineering, enterprise search security
