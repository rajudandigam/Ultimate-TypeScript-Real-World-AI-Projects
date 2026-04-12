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
