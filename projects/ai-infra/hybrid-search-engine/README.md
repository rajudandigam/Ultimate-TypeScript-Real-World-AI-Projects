System Type: Workflow  
Complexity: Level 4  
Industry: AI Infra  
Capabilities: Retrieval  

# Hybrid Search Engine (Vector + Keyword)

## 🧠 Overview
A **workflow-orchestrated retrieval service** that runs **BM25 / inverted index** and **dense vector** searches in parallel (or sequential with prefilter), then **fuses** results with **RRF** or **learned rerankers**, exposing a **single API** with **explainable** score components and **per-tenant** tuning knobs—because pure vector search misses exact SKUs and pure keyword misses paraphrase.

---

## 🎯 Problem
Teams bolt on vector search and get confusing relevance. Hybrid requires **consistent schemas**, **tokenization alignment**, and **evaluation** across corpora—not a one-line “we added embeddings.”

---

## 💡 Why This Matters
- **Pain it removes:** Missed exact matches, synonym drift, and opaque ranking arguments during incidents.
- **Who benefits:** Platform engineers building copilots, support search, and catalog discovery.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Workflow

Serving hybrid search is an **indexing + query pipeline** with scheduled rebuilds, canaries, and rollback—workflow-native.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Multi-index coordination, rerankers, and **SLO-driven** tuning—L5 adds multi-region active-active and formal capacity planning at huge QPS.

---

## 🏭 Industry
Example:
- AI Infra (search, retrieval, discovery platforms)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (core product)
- Planning — light (query decomposition optional upstream)
- Reasoning — optional (reranker model)
- Automation — **in scope** (index rebuild jobs, segment promotion)
- Decision making — bounded (fusion weights by corpus profile)
- Observability — **in scope**
- Personalization — optional (per-user boosts within privacy bounds)
- Multimodal — optional (multivector for images with metadata join)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** query service
- **OpenSearch** (BM25 + kNN) or **Elasticsearch** + separate vector DB
- **Postgres** (catalog, ACL tags, index versions)
- **Redis** (query caches, rate limits)
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Hybrid Search Engine (Vector + Keyword)** (Workflow, L4): prioritize components that match **workflow** orchestration and the **ai-infra** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **Workflow engine (n8n or Temporal)** — n8n for integration-heavy DAGs; Temporal when you need durable sleep, retries, and audit-grade history.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- OpenAI / Anthropic / multi-vendor model APIs
- Kubernetes or Docker APIs if self-hosted
- OIDC provider for tool consent

### Open Source Building Blocks
- **n8n** — fast integration fabric when the blueprint is connector-heavy and ops wants visibility.
- **Temporal + TypeScript SDK** — when you need durable timers, saga compensation, and strict replay semantics.
- **BullMQ + Redis** — lighter option for queue-backed steps without full Temporal yet.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
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
Describe the main components:

- **Input (UI / API / CLI):** Query API, admin tuning UI, index build triggers.
- **LLM layer:** Optional cross-encoder reranker calls (batched), not required for baseline hybrid.
- **Tools / Integrations:** Object storage for raw docs, embedding workers, rerank model servers.
- **Memory (if any):** Per-corpus fusion weight configs; negative boosting rules.
- **Output:** Ranked hits with `{keyword_score, vector_score, fused}` breakdown (debug gated).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Keyword index only; measure baseline.

### Step 2: Add AI layer
- Add embeddings + vector kNN path behind feature flag.

### Step 3: Add tools
- Implement RRF fusion + optional reranker stage.

### Step 4: Add memory or context
- Store click/feedback signals for offline weight tuning (privacy reviewed).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **query planner agent** upstream (separate product component).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** nDCG/MRR vs baseline on labeled query sets; A/B in production with guardrails.
- **Latency:** p95/p99 end-to-end including rerank batches.
- **Cost:** Infra + embedding refresh + rerank GPU $ per 1k queries.
- **User satisfaction:** Click-through, zero-result rate, qualitative relevance reviews.
- **Failure rate:** Index skew between shards, stale deletes, wrong tenant leakage.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** N/A for retrieval-only; if paired with generation elsewhere, keep boundaries clear.
- **Tool failures:** Partial index outage; mitigated by degrade path (keyword-only or vector-only) with banners.
- **Latency issues:** Rerank batching backlog; mitigated by timeouts, candidate caps, async rerank optional.
- **Cost spikes:** Huge k without prefilter; mitigated by metadata filters and HNSW params per corpus size.
- **Incorrect decisions:** Boosting spam docs; mitigated by quality signals, spam filters, and manual blocklists.

---

## 🏭 Production Considerations

- **Logging and tracing:** Query ids, index versions, shard ids; redact sensitive query text where required.
- **Observability:** Fusion weight drift, per-stage latency, cache hit rate, index freshness lag, rerank error rate.
- **Rate limiting:** Per tenant QPS; protect reranker GPU pools.
- **Retry strategies:** Client retries must be safe; server idempotent dedupe on write paths for index updates.
- **Guardrails and validation:** Max `k`, max payload size, block regex-heavy ReDoS queries, ACL enforcement on every hit.
- **Security considerations:** Tenant isolation at index level; encryption; DDoS protection; audit for admin config changes.

---

## 🚀 Possible Extensions

- **Add UI:** Relevance debugger showing which stage dropped a doc.
- **Convert to SaaS:** Hosted hybrid search with BYOC index clusters.
- **Add multi-agent collaboration:** Separate **spam hunter** agent updating blocklists (human approved).
- **Add real-time capabilities:** Near-real-time incremental vectors with streaming updates.
- **Integrate with external systems:** Datadog, Grafana, feature flags, CI eval gates on index deploy.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Nail **hybrid fusion + eval** before fancy agents on top.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **RRF and reranking** tradeoffs
  - **Index lifecycle** management
  - **SLO-aware** retrieval design
  - **System design thinking** for search platforms
