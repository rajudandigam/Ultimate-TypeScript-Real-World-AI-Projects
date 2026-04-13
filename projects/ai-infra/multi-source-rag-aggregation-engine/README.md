System Type: Agent  
Complexity: Level 5  
Industry: AI Infra  
Capabilities: Retrieval, Aggregation  

# Multi-Source RAG Aggregation Engine

## 🧠 Overview
A **retrieval orchestration service** that queries **multiple corpora** (wiki, tickets, code, structured tables), normalizes hits into a **canonical evidence model**, and **fuses/reranks** them into a single context pack for downstream LLMs—with **source attribution**, **conflict detection**, and **tenant ACLs** applied at every hop.

---

## 🎯 Problem
Real enterprise answers depend on more than one system, but naive “query all indexes and concat” creates **duplicates**, **contradictions**, and **token bombs**. You need **fusion logic**, **ranking**, and **provenance** that survives audits—not a bigger context window.

---

## 💡 Why This Matters
- **Pain it removes:** Noisy retrieval, wrong-source wins, and inability to explain why an answer cited ticket A instead of doc B.
- **Who benefits:** Internal copilots, support assistants, and regulated domains requiring traceable evidence bundles.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Aggregation benefits from an **agent loop** that can issue **parallel retrieve** calls, compare snippets, and request clarifying sub-queries—still bounded by **hard token budgets** and **schema validation** on the final pack.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 5. Multi-source RAG at scale needs ACL enforcement, freshness metadata, anti-abuse query limits, and continuous evaluation against golden questions.

---

## 🏭 Industry
Example:
- AI Infra (retrieval platforms, enterprise knowledge fusion)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **core**
- Planning — **in scope** (query planning across sources)
- Reasoning — bounded (conflict notes, abstain when unresolved)
- Automation — optional (scheduled reindex hooks)
- Decision making — bounded (source selection, dedupe)
- Observability — **in scope**
- Personalization — optional (boost trusted corpora)
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **OpenSearch** + **pgvector** (hybrid patterns) or vendor equivalents
- **OpenAI SDK** / reranker APIs
- **Postgres** (ACL metadata, document versions)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Multi-Source RAG Aggregation Engine** (Agent, L5): prioritize components that match **agent** orchestration and the **ai-infra** integration surface.

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

- **Input (UI / API / CLI):** Query + `principal` + list of enabled sources + budget knobs.
- **LLM layer:** Orchestrator agent with tools `search_source`, `fetch_doc`, `compare_snippets`.
- **Tools / APIs:** Per-source connectors with normalized hit records; optional SQL tool for structured facts.
- **Memory (if any):** Short-lived fusion scratchpad; not a second uncontrolled vector store.
- **Output:** `EvidencePack` JSON with ranked chunks, conflict flags, and `staleness` fields per source.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fan-out search to two indexes; concatenate top-k with simple dedupe hash.

### Step 2: Add AI layer
- LLM summarizes conflicts when duplicates disagree (with citations only).

### Step 3: Add tools
- Add structured DB queries and ticket fetches with row-level security.

### Step 4: Add memory or context
- Store per-query fusion decisions for offline eval; retrieve similar past packs for rerank hints (careful privacy).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist sub-agents per source domain merged by deterministic fusion layer.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** nDCG/MRR on multi-hop benchmarks; human-rated citation correctness.
- **Latency:** p95 fusion latency vs single-source baseline.
- **Cost:** Retrieval + rerank + agent tokens per question at quality target.
- **User satisfaction:** Answer usefulness; reduced “wrong doc” escalations.
- **Failure rate:** ACL leaks (must be ~0), timeout storms, contradictory packs without `conflict` flags.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Fusion narrative invents reconciliation; mitigated by requiring explicit conflict objects when scores tie within epsilon.
- **Tool failures:** One source down skews results; mitigated by source health checks and explicit coverage gaps.
- **Latency issues:** Parallel fan-out amplifies tail latency; mitigated by per-source deadlines and partial packs.
- **Cost spikes:** Over-querying; mitigated by budgets and early-stop when sufficient evidence mass reached.
- **Incorrect decisions:** Wrong source wins due to bad boosts; mitigated by offline eval and explainable ranking features.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log source ids and versions, not raw bodies; trace each sub-query.
- **Observability:** Per-source hit rates, conflict rate, token budget utilization, reranker error rate.
- **Rate limiting:** Per tenant and per source; cooperative limits with upstream APIs.
- **Retry strategies:** Per-source retries with jitter; circuit breakers for flaky connectors.
- **Guardrails and validation:** Hard max on returned bytes; schema validation for `EvidencePack`; SSRF protections on URL fetchers.
- **Security considerations:** Row-level security at retrieval SQL; tenant isolation in indexes; encryption for cached payloads.

---

## 🚀 Possible Extensions

- **Add UI:** Evidence inspector for support engineers with provenance timeline.
- **Convert to SaaS:** Hosted connectors with customer VPC agents.
- **Add multi-agent collaboration:** Per-source specialist agents behind one fusion contract.
- **Add real-time capabilities:** Incremental retrieval as user types (debounced).
- **Integrate with external systems:** CRM, Git, Drive, ServiceNow with OAuth brokers.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with deterministic fusion; add agent judgment only where metrics prove lift.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multi-index** retrieval design
  - **Fusion and reranking** tradeoffs
  - **Evidence contracts** for downstream LLMs
  - **System design thinking** for ACL-first RAG
