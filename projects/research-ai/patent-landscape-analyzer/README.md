System Type: Agent  
Complexity: Level 3  
Industry: R&D / IP  
Capabilities: Retrieval, Research  

# Patent Landscape Analyzer

## 🧠 Overview
Navigates **patent corpora + papers** (via **licensed APIs** or **bulk XML** where permitted) to map **white space**, **assignee clusters**, **claim element frequency**, and **potential FTO flags**—outputs are **evidence tables** with **document IDs**; **legal conclusions** remain with counsel.

---

## 🎯 Problem
Landscape memos take weeks; keyword search misses semantic neighbors; teams duplicate filings internally.

---

## 💡 Why This Matters
- **Pain it removes:** Slow portfolio strategy and surprise prior art in diligence.
- **Who benefits:** IP counsel, corporate strategy, and R&D leads.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **retrieval tools** (vector + metadata filters) and **structured extraction** for claim elements.

---

## ⚙️ Complexity Level
**Target:** Level 3 — large-scale retrieval, ranking, and careful disclaimers.

---

## 🏭 Industry
IP / innovation intelligence

---

## 🧩 Capabilities
Retrieval, Research, Reasoning, Observability

---

## 🛠️ Suggested TypeScript Stack
Node.js, OpenSearch + vector, Lens/PatentsView/USPTO APIs (compliance), Postgres matter tracking, OpenAI SDK structured outputs, OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Patent Landscape Analyzer** (Agent, L3): prioritize components that match **agent** orchestration and the **research-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- HTTPS webhooks for your system of record
- OIDC / JWT-based auth on your API surface

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
Seed query → **Landscape Agent** expands synonyms/CPC filters → pulls corpus slice → clusters + timeline charts → gap narrative → export to counsel review workspace

---

## 🔄 Implementation Steps
1. CPC-class scoped baseline  
2. Assignee normalization graph  
3. Claim element extraction with human QC sampling  
4. Family grouping heuristics  
5. Watch mode for weekly deltas  

---

## 📊 Evaluation
Precision@k on known relevant docs, counsel time saved, false “FTO clear” incidents (must be zero unsafe language—use “needs review”)

---

## ⚠️ Challenges & Failure Cases
**Incomplete global coverage** if only one office; **hallucinated patent numbers**; confidential overlap with internal unpublished—strict numeric ID validation, separate air-gapped index for private filings, never assert legal outcomes

---

## 🏭 Production Considerations
API licensing costs, retention policies, export control, privilege workflows when mixing client confidential with public data

---

## 🚀 Possible Extensions
Opposition evidence packet assembly with exhibit numbering automation

---

## 🤖 Agent breakdown
- **Query expansion tool:** controlled synonym/CPC tables, not free-form web.  
- **Retriever agent:** hybrid search with date and jurisdiction filters.  
- **Analyst pass:** clusters, timelines, and gap statements tied to doc IDs only.

---

## 🎓 What You Learn
Patent-scale RAG, evidence discipline, legal-adjacent product boundaries
