System Type: Agent  
Complexity: Level 5  
Industry: AI Infra  
Capabilities: Reasoning, Retrieval  

# AI Knowledge Graph + RAG System

## 🧠 Overview
A **graph-augmented retrieval stack** where **entities and relations** are extracted or synced into a **property graph**, **vector embeddings** live on nodes/chunks, and a **graph-aware agent** answers questions by **traversing** constrained subgraphs plus **RAG** over documents—never trusting unconstrained multi-hop LLM “reasoning” as ground truth without **tool-returned** triples and **provenance** links.

---

## 🎯 Problem
Pure chunk RAG misses structured relationships (“Which customers depend on vendor X?”). Building graphs naively creates garbage edges. You need **ETL discipline**, **governance**, and **query budgets** to keep latency and hallucinations under control.

---

## 💡 Why This Matters
- **Pain it removes:** Brittle joins across silos, weak enterprise Q&A, and analytics questions that need both docs and relationships.
- **Who benefits:** Data platform teams supporting internal copilots, compliance research, and operational troubleshooting.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The user-facing surface is one **analyst-style agent** with tools: `cypher_like_query` (sandboxed), `fetch_doc_chunks`, `expand_neighbors`, `summarize_path`. Multi-agent is optional for **extract vs answer** isolation at L5 scale.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Production implies **multi-tenant graph security**, **lineage**, **incremental graph maintenance**, **SLOs**, **cost controls**, and **formal evaluation** of graph-augmented answers.

---

## 🏭 Industry
Example:
- AI Infra (knowledge graphs, enterprise retrieval, graphRAG)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (chunks + graph context)
- Planning — **in scope** (query plans, hop limits)
- Reasoning — bounded (path explanation over tool results)
- Automation — optional (scheduled graph sync jobs)
- Decision making — bounded (rank candidate entities)
- Observability — **in scope**
- Personalization — optional (user-scoped views of same graph)
- Multimodal — optional (entity extraction from tables in PDFs via pipeline)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** BFF + agent runtime
- **Neo4j** / **TigerGraph** / **AWS Neptune** (pick one; abstract behind repository)
- **OpenSearch + vector** or **pgvector** for chunk store
- **Temporal** (ETL, dedupe, reconciliation)
- **OpenAI SDK** (extraction + agent)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **AI Knowledge Graph + RAG System** (Agent, L5): prioritize components that match **agent** orchestration and the **ai-infra** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability stack** — OpenTelemetry export + LLM trace UI (LangSmith / Helicone / Arize) plus cost dashboards; non-negotiable for L5 blueprints.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- OpenAI / Anthropic / multi-vendor model APIs
- Kubernetes or Docker APIs if self-hosted
- OIDC provider for tool consent

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
- **L5 note:** budget for continuous evals, red-team prompts, cost anomaly alerts, and on-call dashboards — this blueprint assumes production-grade operations.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Natural language questions, saved graph queries, admin ontology UI.
- **LLM layer:** Agent orchestrates graph + vector tools with strict hop and time limits.
- **Tools / APIs:** Parameterized graph queries, vector search, doc fetch, ACL filter injection.
- **Memory (if any):** Session working set of entity ids; audit of traversals.
- **Output:** Answers with citations to **doc chunks** and **edge ids** from the graph.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Vector RAG only; stub empty graph.

### Step 2: Add AI layer
- LLM extracts entities from user question for lookup (validated against dictionary).

### Step 3: Add tools
- Add bounded neighbor expansion and typed edge filters.

### Step 4: Add memory or context
- Incremental ETL from CRM/ITSM into graph with provenance properties on edges.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional extractor workers (non-chat) maintaining graph freshness asynchronously.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Graph path precision on labeled questions; hallucinated edge rate (target ~0).
- **Latency:** p95 for typical hop budgets under production graph size.
- **Cost:** LLM + graph + vector $ per question; heavy queries monitored.
- **User satisfaction:** Analyst trust; reduced time to answer relationship questions.
- **Failure rate:** ACL leaks across subgraphs, timeouts causing empty answers, stale graph edges.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claimed relationships not returned by graph tool; mitigated by citation requirement on triple ids.
- **Tool failures:** Graph store slow; mitigated by aggressive timeouts, partial answers with explicit incompleteness.
- **Latency issues:** Explosive fan-out on high-degree nodes; mitigated by degree caps, sampling, and typed filters.
- **Cost spikes:** Re-embedding entire graph nightly; mitigated by incremental updates keyed by source row versions.
- **Incorrect decisions:** Wrong tenant subgraph; mitigated by mandatory tenant predicates injected server-side, never from model text.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log query shapes, not full result payloads by default; tamper-evident audit for admin queries.
- **Observability:** Traversal depth histogram, cache hit rate, ETL lag, vector vs graph contribution metrics, abuse detection on expensive queries.
- **Rate limiting:** Per user complexity credits; kill switch for expensive patterns.
- **Retry strategies:** Read-only retries; no automatic write tools from the agent in baseline designs.
- **Guardrails and validation:** Query sandbox (allowlisted operations); block arbitrary string concatenation into graph languages from untrusted input.
- **Security considerations:** Graph-level RBAC, encryption, secrets for DB, red-team for cross-tenant leakage, data residency.

---

## 🚀 Possible Extensions

- **Add UI:** Visual subgraph explorer with provenance side panel.
- **Convert to SaaS:** Multi-tenant GraphRAG platform with connector marketplace.
- **Add multi-agent collaboration:** Separate **ontology curator** agent proposals (human merge).
- **Add real-time capabilities:** Streaming traversal updates for live ops dashboards.
- **Integrate with external systems:** Snowflake, ServiceNow, identity graphs, lineage tools (OpenLineage).

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **small curated graphs**; expand ETL only with evaluation and governance.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **GraphRAG** architecture patterns
  - **Query sandboxing** for graph + LLM systems
  - **Provenance** on edges and chunks
  - **System design thinking** for enterprise knowledge systems
